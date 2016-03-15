# -*- coding: utf-8 -*-
import urllib
import sgmllib

class handle_html(sgmllib.SGMLParser):
    def unknown_starttag(self, tag, attrs):
        try:
            for attr in attrs:
                if attr[0] == "href":
                    print attr[0]+":"+attr[1].encode('utf-8')

        except:
            pass


web = urllib.urlopen("http://freebuf.com/")
web_handler = handle_html()
web_handler.feed(web.read())

