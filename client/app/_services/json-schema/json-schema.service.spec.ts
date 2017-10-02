import { TestBed, inject } from '@angular/core/testing';

import { JsonSchemaService } from './json-schema.service';

describe('JsonSchemaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JsonSchemaService]
    });
  });

  it('should be created', inject([JsonSchemaService], (service: JsonSchemaService) => {
    expect(service).toBeTruthy();
  }));
});
