var chalk = require('chalk')
	,helpers = require('./helpers')
	,fsPlus = require('./fs-plus')
	,fs = require('fs')
	,_ = require('underscore.string')
	,mkdirp = require('mkdirp')
	,dictionary = require('./dictionary')
	,log = console.log
	,path = require('path');

function compileTemplate(root,dest,props,callback){

	var context = helpers.merge(props,{_: _})
		,templatePath = function(tmpName){
			return path.join(root,tmpName);
		}
		,destinationPath = function(fileName){
			return path.join(dest,fileName);
		}
		,ext = props.generatorType == 'view' ? '.html' : '.js'
		,fileName = function(){
			var name = props.generatorType === 'module-empty' ? 'module' : '';
      console.log(name);
			if(!name){
				name = props.generatorType;
			}

			return helpers.dasherize(props.name + '.' + name + ext);
		}
		,destination = (function(){
			var subfolder = (
				props.generatorType === 'module' ||
				props.generatorType === 'module-empty'
			) ? '' : (dictionary[props.generatorType] || props.generatorType) + 's/';

			console.log(props);
			return 'src/app/' + (props.inCommon ? 'common/' : '')
				+ helpers.dasherize(props.folderName) + '.module/'
				+ subfolder;
		})()
		,fName = destinationPath(destination + fileName())
		,tName = templatePath('_' + props.generatorType + ext)
		,compileTmpl = function(){
			fsPlus.copyTpl(
				tName
				,fName
				,context
			);
		}
		,commit = function(){
			if(callback){
				callback(fName);
			}else{
				fsPlus.commit(function(){
					fs.chmodSync(fName,'755');
					log(chalk.green('--------Success--------'));
				});
			}
		};

	//does a directory exist
	fs.stat(destination,function(err,stats){
		if(err){

			log(chalk.yellow('--------Warning--------'));
			log(chalk.yellow('You did not have proper folder!'));
			log(chalk.red(destination));
			log(chalk.yellow('I have created folder structure for you'));
			log(chalk.yellow('-----------------------'));

			mkdirp(destination,function(){
				//write file
				compileTmpl();
				commit();
			});
		}else{
			//does a file exist
			fs.stat(fName,function(err,stats){
				if(err){
					//write file
					compileTmpl();
					commit();
				}else{
					log(chalk.yellow('--------Warning--------'));
					log(chalk.yellow('You have this file'));
					log(chalk.red(fName));
					log(chalk.yellow('skip...'));
					log(chalk.yellow('-----------------------'));
					commit();
				}
			});
		}
	});
}

module.exports = compileTemplate;
