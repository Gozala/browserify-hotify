# hotify

This is a [browserify][] transform that makes module bundles hot in [HMR (Hot Module Replacement)][HMR] terms. It is meant to be used in combination with [browserify-hmr][] that deals with hot reloading.

This transform does not attempts to reload only updated modules like [react-hot-reload][], instead it assumes that your application is written such that reloading all of it will do the right thing. In practice it's being developed for [reflex][] as it's architecture allows full application code swap without loosing a state. If your application architecture matches you should be able to use this transform as well.

[browserify]:http://browserify.org
[browserify-hmr]:https://github.com/AgentME/browserify-hmr
[HMR]:https://webpack.github.io/docs/hot-module-replacement.html
[react-hot-reload]:http://gaearon.github.io/react-hot-loader/
[reflex]:http://github.com/gozala/reflex
