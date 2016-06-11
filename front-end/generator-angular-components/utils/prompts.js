var prompts = {
	types: [
		{
			name: 'generatorType'
			,message: '---'
			,type: 'list'
			,choices: [
			{
				name: 'Controller'
				,value: 'controller'
			}
			,{
				name: 'Directive'
				,value: 'directive'
			}
      ,{
        name: 'Config'
        ,value: 'config'
      }
			,{
				name: 'Module'
				,value: 'module'
			},
      {
        name: 'Model'
        ,value: 'model'
      }
			,{
				name: 'Module Empty'
				,value: 'module-empty'
			}
			,{
				name: 'Service'
				,value: 'service'
			}
		]
			,default: 0
		}
	]
	,inputs: [
		{
			name: 'name'
			,message: 'Name: ***'
			,type: 'input'
		}
		,{
			name: 'moduleName'
			,message: 'In which module? CM.***'
			,type: 'input'
		}
		,{
			name: 'inCommon'
			,message: '---'
			,type: 'list'
			,choices: [
			{
				name: 'In module'
				,value: false
			}
			,{
				name: 'In common module'
				,value: true
			}
		]
			,default: 0
		}
	]
	,module: [
		{
			name: 'moduleName'
			,message: 'Name: ***'
			,type: 'input'
		}
		,{
			name: 'inCommon'
			,message: '---'
			,type: 'list'
			,choices: [
				{
					name: 'In root'
					,value: false
				}
				,{
					name: 'In common folder'
					,value: true
				}
			]
			,default: 0
		}
	]
};

module.exports = prompts;
