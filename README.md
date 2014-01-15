Copyright 2013 NPR.  All rights reserved.  No part of these materials may be reproduced, modified, stored in a retrieval system, or retransmitted, in any form or by any means, electronic, mechanical or otherwise, without prior written permission from NPR.

(Want to use this code? Send an email to nprapps@npr.org!)

nprapps.github.com
==================

### Getting Started

Matt Stiles has a helpful post explaining [how to get set up](http://blog.apps.npr.org/2012/11/08/npr-news-apps-blog.html).

Once you have Jekyll installed, run this command to start up the development server and have it automatically regenerate files:

```
jekyll serve --watch
```

You can see it in your browser here:

```
http://localhost:4000
```

### Things To Know

* Pushing code to the repo will automatically publish any changes you've made. If you're not ready to publish yet, save your changes to a separate branch, and then merge it back to ```master``` when you're ready.

* Writing a blog post? [Use this as a starting point.](https://github.com/nprapps/nprapps.github.com/blob/master/_posts/2013-12-10-the-book-concierge.markdown)

* Linking to a post we've written somewhere else (like Source)? [Use this as a starting point.](https://github.com/nprapps/nprapps.github.com/blob/master/_posts/2014-01-02-source-tshirt-ux.markdown)

### How To Embed Code Snippets

Save your code snippet as a Gist on your GitHub account. For example: https://gist.github.com/alykat/8319004

Take the username and Gist ID in the URL and sub it into the script tag below:

```
<script src="https://gist.github.com/YOUR-USERNAME/GIST-ID.js"> </script>
```

So the example Gist URL would get you:

```
<script src="https://gist.github.com/alykat/8319004.js"> </script>
```
