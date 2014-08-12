# Formalize [![Build Status](https://travis-ci.org/frisb/formalize.png)](http://travis-ci.org/frisb/formalize)

[![npm status badge](https://nodei.co/npm/formalize.png?stars=true&downloads=true)](https://nodei.co/npm/formalize/)

Formalize is an ActiveRecord ORM layer for FoundationDB.

This module is in alpha and work is still in progress. All contributions are welcome.

## Example Usage

``` js
var Formalize = require('formalize')('foundationdb');

var options = {
  schema: {
    firstName: 'f',
    lastName: 'l'
  }
}

var Person = Formalize.ActiveRecord('Person', options);

var p = new Person();
p.firstName = 'Ashley';
p.lastName = 'Brener';

p.save(function () {
  Person.all(function (err, people) {
    if (!err) {
      console.log(people);
    }
  });
);

```

## Installation
```
npm install formalize
```

## License

(The MIT License)

Copyright (c) frisB.com &lt;play@frisb.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[![Analytics](https://ga-beacon.appspot.com/UA-40562957-7/formalize/readme)](https://github.com/igrigorik/ga-beacon)
