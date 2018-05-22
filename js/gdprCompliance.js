var ensureGDPRConsent = function() {
    // To comply with GDPR's privacy and anti-tracking rules,
    // check whether the user is inside the EU (using a call to
    // `gdprEndpoint`). If they are, then they'll have to provide
    // consent before being redirected back to the visual. Otherwise
    // continue as normal.
    // Once a user (inside or outside of the EU) has passed this check,
    // they will have `gdpr=true` in their cookie.

    var siteDomain = 'blog.apps.npr.org';
    var gdprEndpoint = 'https://identity.api.npr.org/v2/gdpr';
    var consentFormEndpoint = 'https://choice.npr.org/';
    var originQueryString = '?origin=' + location.href;

    if (document.cookie.indexOf('gdpr=true') === -1) {
        // If the user is being redirected to the page from the consent
        // form, this means that they have accepted the terms
        if (document.referrer === consentFormEndpoint + originQueryString) {
            document.cookie = 'gdpr=true;domain=' + siteDomain + ';path=/';
        } else {
            // Otherwise, make a request against the GDPR endpoint, which
            // checks whether the user is within the EU
            var request = new XMLHttpRequest();
            request.open('GET', gdprEndpoint, true);
            // A successful load (status code `204`) indicates that the user
            // is outside of the EU
            request.addEventListener('load', function (e) {
                document.cookie = 'gdpr=true;domain=' + siteDomain + ';path=/';
            });
            // An unsuccessful load (a `302` redirect to a page that rejects
            // CORS requests) indicates that the user is inside the EU
            request.addEventListener('error', function (e) {
                window.location.href = gdprEndpoint + originQueryString;
            });
            request.send();
        }
    }
}

ensureGDPRConsent();
