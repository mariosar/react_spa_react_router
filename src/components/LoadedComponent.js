import React from 'react';

export default class LoadedComponent extends React.Component{
	render(){
		return(
			<div>
				This only loads when we arrive at the page. Not bundled with the bundler.
			</div>
		)
	}
}
