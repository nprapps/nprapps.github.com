from lxml.html import parse

#prompt for github url
github_url = raw_input("GitHub URL: ")

#prompt for url
deployed_url = raw_input("Deployed URL: ")

#scrape the site
doc = parse(deployed_url).getroot()
name = doc.cssselect('meta[property=og\:title]')[0].attrib['content']
description = doc.cssselect('meta[property=og\:description]')[0].attrib['content']
image = doc.cssselect('meta[property=og\:image]')[0].attrib['content']

#output yaml
print '- name: "%s"' % name
print '  description: "%s"' % description
print '  date: '
print '  image: "%s"' % image
print '  url: %s' % deployed_url
print '  github_url: %s' % github_url