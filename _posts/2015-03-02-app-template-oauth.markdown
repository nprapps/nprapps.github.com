---
layout: post
title: "Switching to OAuth in the App Template"
description: "We updated the way the App Template gets data from Google Drive. Here's what it means for you."

author: David Eads
email: visuals@npr.org
twitter: nprviz
---

*Suyeon Son and David Eads re-worked the authentication mechanism for accessing Google Spreadsheets with the NPR Visuals App Template. This is a significant change for App Template users. Here’s why we did it and how it works.*

*Most App Template developers only need to consult the [Configuring your system](#configure) and [Authenticating](#authenticate) sections of this post, provided someone on your team has gone through the process of creating a Google API application and given you credentials.*

## Why OAuth?

Prior to this change, the App Template accessed Google spreadsheets with a user account and password. These account details were accessed from environment variables stored in [cleartext](http://en.wikipedia.org/wiki/Plaintext). Storing a password in cleartext is a bad security practice, and the method led to other dubious practices like sharing credentials for a common Google account.

[OAuth](http://en.wikipedia.org/wiki/OAuth) is a protocol for accessing online resources on behalf of a user without a password. The user must authenticate with the service using her password to allow the app to act on her behalf. In turn the app receives a magic access token. Instead of directly authenticating the user with the service, the application uses the token to access resources.

There are many advantages to this approach. These access tokens can be revoked or invalidated. If used properly, OAuth credentials are always tied to an individual user account. An application can force all users to re-authenticate by resetting the application credentials. Accessing Google Drive resources with this method is also quite a bit faster than our previous technique.

## Setting up the Google API application

To use the new OAuth feature of the App Template, you will need to create a Google API project and generate credentials. Typically, you’ll only need to do this once for your entire organization.

Visit the [Google Developer’s Console](https://console.developers.google.com/) and click “Create Project”.

<img src="/img/posts/oauth-create-project.png"/>

Give the project a name for the API dashboard and wait for the project to be created:

<img src="/img/posts/oauth-spin-spin-spin.png"/>

Give the project a name again (oh, technology!) by clicking “Consent screen” in the left hand toolbar:

<img src="/img/posts/oauth-consent-screen.png"/>

Enable the Drive API by clicking “APIs” in the left hand toolbar, searching for “Drive” and enabling the Drive API:

<img src="/img/posts/oauth-api-screen.png"/>

You can optionally disable the default APIs if you’d like.

Finally, create client credentials by clicking “Credentials” in the left hand toolbar and then clicking “Create New Client ID”:

<img src="/img/posts/oauth-client-id-create.png"/>

Make sure “Web application” is selected. Set the Javascript origins to “http://localhost:8000” and “http://127.0.0.1:8000”. Set the Authorized Redirect URIs to “http://localhost:8000/authenticate/” and “http://127.0.0.1:8000/authenticate/”:

<img src="/img/posts/oauth-create-details.png"/>

Now you have some credentials:

<img src="/img/posts/oauth-get-creds.png"/>

<a name="configure"></a>
## Configuring your system

Whew! Happily, that’s the worst part. Typically, you should only do this once for your whole organization.

Add some environment variables to your `.bash_profile` or current shell session based on the client ID credentials you created above:

{% highlight bash %}
export GOOGLE_OAUTH_CLIENT_ID="825131989533-7kjnu270dqmreatb24evmlh264m8eq87.apps.googleusercontent.com"
export GOOGLE_OAUTH_CONSUMER_SECRET="oy8HFRpHlJ6RUiMxEggpHaTz"
export AUTHOMATIC_SALT="mysecretstring"
{% endhighlight %}

As you can see above, you also need to set a random string to act as cryptographic salt for the OAuth library the App Template uses.

<a name="authenticate"></a>
## Authenticating

Now, run `fab app` in your App Template project and go to [localhost:8000](http://localhost:8000) in your web browser. You’ll be asked to allow the application to access Google Drive on behalf of your account:

<img src="/img/posts/oauth-process-start.png"/>

If you use multiple Google accounts, you might need to pick one:

<img src="/img/posts/oauth-pick-an-account.png"/>

Google would like you to know what you’re getting into:

<img src="/img/posts/oauth-allow-access.png"/>

That’s it. You’re good to go!

<img src="/img/posts/oauth-success.png"/>

## Bonus: Automatically reloading the spreadsheet

Any route decorated with the `@oauth_required` decorator can be passed a `refresh=1` querystring parameter which will force the latest version of the spreadsheet to be downloaded (e.g. [localhost:8000/?refresh=1](http://localhost:8000/?refresh=1)).

This is intended to improve the local development experience when the spreadsheet is in flux. 

## Behind the scenes

The new system relies on the awesome [Authomatic library](http://peterhudec.github.io/authomatic/) (developed by a photojournalist!). 

We provide a decorator in `oauth.py` that wraps a route with a check for valid credentials, and re-routes the user through the authentication workflow if the credentials don’t exist.

Here’s an example snippet to show how it works:

{% highlight python %}
from flask import Flask, render_template
from oauth import oauth_required

app = Flask(__name__)

@app.route('/')
@oauth_required
def index():
    context = {
        ‘title’: ‘My awesome project’,
    }
    return render_template(‘index.html’, **context)
{% endhighlight %}

Authomatic provides an interface for serializing OAuth credentials. After successfully authenticating, the App Template writes serialized credentials to a file called `~/.google_oauth_credentials` and reads them when needed.

By using the so-called “offline access” option, the credentials can live in perpetuity, though the access token will change from time-to-time. Our implementation hides this step in a function called `get_credentials` which automatically refreshes the credentials if necessary.

By default, credentials are global -- once you’re authenticated for one app template project, you’re authenticated for them all. But some projects may require different credentials -- perhaps you normally access the project spreadsheet using your `USERNAME@YOURORG.ORG` account, but for some reason need to access it using your `OTHERUSERNAME@GMAIL.COM` account. In this case you can specify a different credentials file in `app_config.py` by changing `GOOGLE_OAUTH_CREDENTIALS_PATH`:

{% highlight python %}
GOOGLE_OAUTH_CREDENTIALS_PATH = '~/.special_project_credentials'
{% endhighlight %}

Finally, the Google Doc access mechanism has changed. If you need to access a Google spreadsheet that's not involved with the default COPY rig, use the new `get_document` helper function. `get_document()` takes two parameters: a spreadsheet key and path to write the exported Excel file. Here's an example of what you might do:

{% highlight python %}
from copytext import Copy
from oauth import get_document

def read_my_google_doc():
    file_path = 'data/extra_data.xlsx'
    get_document('0AlXMOHKxzQVRdHZuX1UycXplRlBfLVB0UVNldHJYZmc', file_path)
    data = Copy(file_path)

    for row in data['example_list']:
        print '%s: %s' % (row['term'], row['definition'])

read_my_google_doc()
{% endhighlight %}
