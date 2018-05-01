# UI-NODE-FEATURE-SWITCH
NODE Feature Switch is used to check if a feature has been enabled on the JTMG Control Panel. This feature has a direct dependency on JTMG-UI-ng-FEATURE-SWITCH https://www.npmjs.com/package/@jtmgio/jtmg-ui-ng-feature-switch

## Build App
```
npm publish 
```

## INSTALLATION
```
npm i @jtmgio/jtmg-ui-node-feature-switch --save
```

## Example Implementation 
https://github.com/jtmgio/ui-reference-app/tree/master/public/deep-linking
## Use In Node App
The following code snippet is required to use this library 

### Default Route FIle
In your default route file that will be used to handle health checks you will need to include the below snippet in your set routes FN, Please ensure you are including your app config as a lib. 
```ts
    featureSwitch.featureSwitchStart(app, config);
```

### Ensure you have redis in your config
The library has a dependency on redis, please ensure you have the correct redis link in your app. Example
configs/config.js
```ts
config.redis_server = process.env.REDIS_SERVER || "REDIS CONNECTION URL";
```

### Ensure you have also setup the JTMG-UI-NG-FEATURE-SWITCH	
this will not work with out JTMG-UI-NG-FEATURE-SWITCH	https://www.npmjs.com/package/@jtmgio/jtmg-ui-ng-feature-switch activated