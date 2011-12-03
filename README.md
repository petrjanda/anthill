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

