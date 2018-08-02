class JSONSchema {

  'definitions': any;
  '$schema': String;
  'id': String;
  'title': String;
  'type': String;
  'properties': any;
  'additionalProperties': Boolean;
  'required': Array<String>;

  constructor() {
    this.$schema = 'http://json-schema.org/draft-06/schema#';
    this.definitions = {
      'Binary': {
        'title': 'Binary',
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
      'RegExp': {
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
      'DBRef': {
        'title': 'DBRef',
        'type': 'object',
        'properties': {
          '$id': {
            'type': 'string'
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
      }
    };
    this.properties = {};
    this.additionalProperties = false;
  }
}

export default JSONSchema;
