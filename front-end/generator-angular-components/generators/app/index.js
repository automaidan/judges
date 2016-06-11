'use strict';

var yeoman = require('yeoman-generator')
	,chalk = require('chalk')
	,helpers = require('../../utils/helpers')
	,prompts = require('../../utils/prompts')
	,compileTemplate = require('../../utils/compileTemplate')
	,fsPlus = require('../../utils/fs-plus')
	,fs = require('fs')
	,log = console.log
	,async = require('async')
	,extend = require('util')._extend
  ,_ = require('underscore.string');

module.exports = yeoman.generators.Base.extend({
	prompting: function(){
		var done = this.async()
			,set1 = prompts.types
			,set2;

		this.prompt(set1,function(props){
			// To access props later use this.props.someOption;
			this.props = props;
			if(
				this.props.generatorType === 'module' ||
				this.props.generatorType === 'module-empty'
			){
				set2 = prompts.module;
			}else{
				set2 = prompts.inputs;
			}

			this.prompt(set2,function(propsSecond){
				this.props = helpers.merge(this.props,propsSecond);
				done();
			}.bind(this));

		}.bind(this));
	}
	,writting: function(){
		var root = this.sourceRoot()
			,dest = this.destinationRoot()
			,props = this.props;

		this.props.folderName = this.props.moduleName;
		this.props.moduleName = (this.props.inCommon ? 'common.' : '') + _.classify(this.props.moduleName);

		if(
			this.props.generatorType==='module'||
			this.props.generatorType==='module-empty'
		){
			this.props.name = this.props.moduleName;
		}

		switch(this.props.generatorType){
			case 'module':
				async.series([
					write('module')
					,write('controller')
					,write('config')
					,write('directive')
          ,write('model')
          ,write('routes')
					,write('service')
					,write('view')
				],commonCommit);
				break;
			case 'directive':
				async.series([
					write('directive')
					,write('view')
				],commonCommit);
				break;
			default:
				compileTemplate(root,dest,props);
		}

		//implementation
		function write(genType,name){
			return function (callback){
				var config = extend({},props);

				config.generatorType = genType;
				if(name){
					config.name = config.name + name;
				}
				compileTemplate(root,dest,config,function(destFile){
					callback(null,destFile);
				});
			}
		}

		function commonCommit(err, results){
			var args = Array.prototype.slice.call(results);
			fsPlus.commit(function(){
				args.forEach(function (res){
					fs.chmodSync(res,'755');
				});
				log(chalk.green('--------Success--------'));
			});
		}
	}
});
