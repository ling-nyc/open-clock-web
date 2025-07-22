## Fork of Mike Castleman's web renderer

## Todo:
- ~~split css into separate files~~ ✅ **COMPLETED**
- improve renderer, broken in some cases
- easier font management
- potential json editor embedded in the site?? maybe


# open-clock-web

A web renderer for the [OpenClockStandard][].

**WIP, very early stages, doesn't do much yet**

## Hacking

To get the dependencies:

1. Install [`node.js`][node.js] and [yarn][] if you don't already have them.
1. Clone the repo.
1. do `yarn install`
1. ~~install [jtd-codegen][] if you will be modifying any schemas~~ (no longer needed)
1. obtain the fonts, and put them into a directory called `fonts` under the root of the repo. rename `PIXEL_MILLENNIUM.TFF` to `PIXEL_MILLENNIUM.TTF`

Now, the following commands are available to you:

- `yarn dev` to spin up a dev server for making changes
- `yarn build` to build for production
- ~~`yarn gen-schema` to rebuild the relevant typescript files if you touch the clock JTD schema~~ (no longer needed - TypeScript types are manually maintained)

## Further info

Contact [mlc][].

[openclockstandard]: https://github.com/orff/OpenClockStandard/
[node.js]: https://nodejs.org/
[yarn]: https://yarnpkg.com/
[jtd-codegen]: https://jsontypedef.com/docs/jtd-codegen/#installing-jtd-codegen
[mlc]: https://github.com/mlc/
