# SQL App Parser

TLDR: App that parses and extracts table and column name info from SQL queries

This project has an api and application to extracts table and column info from SQL queries.

It uses the excellent [sql-metadata](https://github.com/macbre/sql-metadata) library under the hood. 


## Working examples

Application: https://sql-app.infocruncher.com/

Api: https://sql-api.infocruncher.com/


## Project Structure

### App

The `/client` folder is a [Terraform](https://www.terraform.io/) managed S3 website app hosted at [sql-app.infocruncher.com](https://sql-app.infocruncher.com/) that uses the [api](https://sql-api.infocruncher.com/) endpoint. 

See `/client/Makefile` for more information around deploying the app to AWS.


### Api

The project root is an [AWS SAM](https://aws.amazon.com/serverless/sam/) managed API [sql-api.infocruncher.com](https://sql-api.infocruncher.com/) consisting of an API Gateway with Lambda backend. 

The actual app that is deployed to Lambda is Dockerised and can be found in `/app` 

See `/Makefile` for more information around deploying the api to AWS.

Example Api response given a POST request with `SELECT test as alias_test, id FROM foo, bar LIMIT 100`:

```
{
  "query": "SELECT test as alias_test, id FROM foo, bar LIMIT 100",
  "result": {
    "table_names": [
      "foo",
      "bar"
    ],
    "column_names": [
      "test",
      "id"
    ],
    "column_aliases": [
      "alias_test"
    ],
    "limit_offset": [
      100,
      0
    ],
    "values": null,
    "subqueries_names": []
  },
  "handler_time": "0:00:00.001822",
  "runtime_time": "0:01:28.981600",
  "version": "1.0.0"
}
```
