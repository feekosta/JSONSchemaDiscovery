class JSONSchema {

  'definitions': any;
  '$schema': String;
  '$id': String;
  'title': String;
  'description': String;
  'type': String;
  'properties': any;
  'additionalProperties': Boolean;
  'required': Array<String>;

  constructor(databaseTitle: String) {
    this.$id = `https://jsonschemadiscovery.com/schemas/${databaseTitle}`;
    this.$schema = 'https://json-schema.org/draft/2019-09/schema';
    this.title = databaseTitle;
    this.description = `JSON Schema for a ${databaseTitle} collection`;
    this.type = 'object';
    this.definitions = {
      'Binary': {
        'title': 'Binary',
        'anyOf': [{
          'type': 'object',
          'properties': {
            '$binary': {
              'type': 'string'
            },
            '$type': {
              'type': 'string'
            }
          },
          'required': ['$binary', '$type']
        }, {
          'type': 'object',
          'properties': {
            '$binary': {
              'type': 'object',
              'properties': {
                'base64': {
                  'type': 'string'
                },
                'subType': {
                  'type': 'string'
                }
              },
              'required': ['base64', 'subType']
            }
          }
        }],
      },
      'Undefined': {
        'title': 'Undefined',
        'type': 'object',
        'properties': {
          '$undefined': {
            'type': 'boolean'
          }
        },
        'required': ['$undefined']
      },
      'ObjectID': {
        'title': 'ObjectID',
        'type': 'object',
        'properties': {
          '$oid': {
            'type': 'string'
          }
        },
        'required': ['$oid']
      },
      'ObjectId': {
        'title': 'ObjectId',
        'type': 'object',
        'properties': {
          '$oid': {
            'type': 'string'
          }
        },
        'required': ['$oid']
      },
      'Date': {
        'title': 'Date',
        'type': 'object',
        'properties': {
          '$date': {
            'type': 'string'
          }
        },
        'required': ['$date']
      },
      '_RegExp': {
        'title': 'RegExp',
        'type': 'object',
        'properties': {
          '$options': {
            'type': 'string'
          },
          '$regex': {
            '$type': 'string'
          }
        },
        'required': ['$options', '$regex']
      },
      'RegExp': {
        'title': 'RegExp',
        'anyOf': [{
          'title': 'RegExp',
          'type': 'object',
          'properties': {
            '$options': {
              'type': 'string'
            },
            '$regex': {
              '$type': 'string'
            }
          },
          'required': ['$options', '$regex']
        }, {
          'type': 'object',
          'properties': {
            '$regularExpression': {
              'type': 'object',
              'properties': {
                'pattern': {
                  'type': 'string'
                },
                'options': {
                  'type': 'string'
                }
              },
              'required': ['pattern', 'options']
            }
          },
          'required': ['$regularExpression']
        }],
      },
      'DBRef': {
        'title': 'DBRef',
        'type': 'object',
        'properties': {
          '$id': {
            '$ref': '#/definitions/ObjectId'
          },
          '$ref': {
            'type': 'string'
          }
        },
        'required': ['$id', '$ref']
      },
      'Code': {
        'title': 'Code',
        'type': 'object',
        'properties': {
          '$code': {
            'type': 'string'
          },
          '$scope': {
            'type': 'object'
          }
        },
        'required': ['$code']
      },
      'Timestamp': {
        'title': 'Timestamp',
        'type': 'object',
        'properties': {
          '$timestamp': {
            'type': 'object',
            'properties': {
              'i': {
                'type': 'integer'
              },
              't': {
                'type': 'integer'
              }
            },
            'required': ['i', 't']
          }
        },
        'required': ['$timestamp']
      },
      'Long': {
        'title': 'NumberLong',
        'type': 'object',
        'properties': {
          '$numberLong': {
            'type': 'string'
          }
        },
        'required': ['$numberLong']
      },
      'NumberLong': {
        'title': 'NumberLong',
        'type': 'object',
        'properties': {
          '$numberLong': {
            'type': 'string'
          }
        },
        'required': ['$numberLong']
      },
      'NumberInt': {
        'title': 'NumberInt',
        'type': 'object',
        'properties': {
          '$numberInt': {
            'type': 'string'
          }
        },
        'required': ['$numberInt']
      },
      'NumberDouble': {
        'title': 'NumberDouble',
        'type': 'object',
        'properties': {
          '$numberDouble': {
            'type': 'string'
          }
        },
        'required': ['$numberDouble']
      },
      'Decimal128': {
        'title': 'Decimal128',
        'type': 'object',
        'properties': {
          '$numberDecimal': {
            'type': 'string'
          }
        },
        'required': ['$numberDecimal']
      },
      'MinKey': {
        'title': 'MinKey',
        'type': 'object',
        'properties': {
          '$minKey': {
            'type': 'integer'
          }
        },
        'required': ['$minKey']
      },
      'MaxKey': {
        'title': 'MaxKey',
        'type': 'object',
        'properties': {
          '$maxKey': {
            'type': 'integer'
          }
        },
        'required': ['$maxKey']
      },
      'Symbol': {
        'title': 'Symbol',
        'type': 'object',
        'properties': {
          '$symbol': {
            'type': 'string'
          }
        },
        'required': ['$symbol']
      }
    };
    this.properties = {};
    this.additionalProperties = false;
  }
}

export default JSONSchema;
