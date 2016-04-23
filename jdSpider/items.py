# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class JdspiderItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass


class SkuIdItem(scrapy.Item):
    product_id = scrapy.Field()


class ProductInfoItem(scrapy.Item):
    product_info = scrapy.Field()
    product_id = scrapy.Field()


class CommentsItem(scrapy.Item):
    comments = scrapy.Field()
