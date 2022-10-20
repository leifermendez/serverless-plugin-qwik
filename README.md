# serverless-plugin-qwik
This is a Serverless plugin that should make scan about differents packages implementeds in your Qwik application.

```shell
npm i serverless-plugin-qwik@latest -D
```


> Note: This plugin require the next plugins for you proper use.
- [serverless-plugin-common-excludes](https://github.com/dougmoscrop/serverless-plugin-common-excludes)
- [serverless-plugin-include-dependencies](https://github.com/dougmoscrop/serverless-plugin-include-dependencies)

Your __serverless.yml__ should be similar to the next

```yml
package:
  excludeDevDependencies: false
plugins:
  - serverless-plugin-qwik
  - serverless-plugin-common-excludes
  - serverless-plugin-include-dependencies
```

### Why?
Qwik implement your `packages` inside `devDependencies` because that is necesary set  `excludeDevDependencies:false`. But don't worrie i know you need deploy only the specifically dependencies for that  `serverless-plugin-common-excludes` and `serverless-plugin-include-dependencies` 

### Collaboration
Always is very welcome any collaboration.
