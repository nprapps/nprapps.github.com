Copyright 2013-14 NPR.  All rights reserved.  No part of these materials may be reproduced, modified, stored in a retrieval system, or retransmitted, in any form or by any means, electronic, mechanical or otherwise, without prior written permission from NPR.

(Want to use this code? Send an email to nprapps@npr.org!)

nprapps.github.com
==================

### Getting Started

Matt Stiles wrote a helpful post explaining [how to get set up](http://blog.apps.npr.org/2012/11/08/npr-news-apps-blog.html).

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

A couple options:

* Tab-indent your code, and Markdown will recognize it as a code snippet. However, if that snippet includes ```{{ }}``` tags, wrap the block of code in ```{% raw %} {% endraw %}``` to escape it. ([Example](https://github.com/nprapps/nprapps.github.com/commit/5ead926c125807af9a41afce80baba0628bc2aa9#diff-f81649843a7256ddce49a0cb115a3a27))

* Save your code snippet as a Gist on your GitHub account &mdash; for example, https://gist.github.com/alykat/8319004. Take the username and Gist ID in the URL and sub it into the script tag: ```<script src="https://gist.github.com/YOUR-USERNAME/GIST-ID.js"> </script>```
