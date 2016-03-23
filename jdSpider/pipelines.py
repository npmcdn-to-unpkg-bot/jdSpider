# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html

import functools
import redis
from jdSpider import redis_pool

r = redis.Redis(connection_pool=redis_pool)


def check_spider_pipeline(process_item_method):
    @functools.wraps(process_item_method)
    def wrapper(self, item, spider):
        # message template for debugging
        msg = '%%s %s pipeline step' % (self.__class__.__name__,)

        # if class is in the spider's pipeline, then use the
        # process_item method normally.
        if self.__class__ in spider.pipeline:
            spider.logger.debug(msg % 'executing')
            return process_item_method(self, item, spider)

        # otherwise, just return the untouched item (skip this step in
        # the pipeline)
        else:
            spider.logger.debug(msg % 'skipping')
            return item

    return wrapper


class JdCommentsPipeline(object):
    def process_item(self, item, spider):
        return item


class SkuidRedisPipeline(object):
    @check_spider_pipeline
    def process_item(self, item, spider):
        r.sadd('productId:queue', item['product_id'])
        r.sadd('commentsId:queue', item['product_id'])
        return item


class CommentMongoPipeline(object):
    @check_spider_pipeline
    def process_item(self, item, spider):
        pass


class ProductMongoPipeline(object):
    @check_spider_pipeline
    def process_item(self, item, spider):
        pass
