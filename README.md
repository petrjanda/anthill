[![build status](https://secure.travis-ci.org/petrjanda/anthill.png)](http://travis-ci.org/petrjanda/anthill)
# ANTHILL - IPC publish / subscribe architecture for node.js

## Motivation

Node.js application run in a single process. Its essential of how node.js work and can probably handle thousands of concurrent connections. Nevertheless development of one monolithic app has certaion disadvantages:

* One failing piece of app can take it all down
* Can be harder to plugin new component
* Its harder to decouple system components
* Make it more difficult to manage the whole development
* etc.

The other way around is to split your app into pieces. In node.js that could be the separate processes. One process then take care about certain thing, certain subset of domain logic you intend to solve.

## Architecture

The whole solution build on top of Dnode by James Halliday, the RPC library to allow inter process communication. It works even with Ruby, Perl or Java. Anthill builds on top of that and add publish / subscribe architecture. Your processes do their work themselves, and emit the events to outside world in case something important happened. There might be someone else interested about that. Other process then just subscribe for a given events.

## License

Copyright (c) 2011 Petr Janda

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.