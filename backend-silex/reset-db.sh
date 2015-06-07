#!/bin/sh
rm uman.sqlite
vendor/bin/doctrine orm:schema-tool:create
