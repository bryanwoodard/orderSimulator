/*
version 1.0.1
To be included in next release v1.1:
	- optimize code, eliminate redundancies
	- better code notes
	- error handling
	- figure better way to include spec prod string and nums for when defaults values arent good enough
*/

window.orderSim = window.orderSim || {
	//"send" function builds out object and send the utag tracking call.
	//take 6 params - currently only works with first 4 though
	// specProdStrings & specProdNums yet to be handled
		// for setting up product values when defualts arent good enough
	send: function(type, prodNum, objJoin, tagArray, specProdStrings, specProdNums ){
		if ((type == "link" || type == "view") && !isNaN(prodNum)){
			var obj = this.buildProdVals(prodNum, specProdStrings, specProdNums) // changed to allow for specific prod values
			if(objJoin){
				Object.assign(obj, objJoin);
			}
			utag[type](obj,null,tagArray);
		}else{
			console.log("Invalid utag tracking method");
		}
	},
	//"buildString" - Takes in number, and returns and array with a length of params passed
	// array values are alphanumeric random strings
	// used for making : order id, and non numeric product values
	buildString: function(num){
		var arr = []
		num = parseFloat(num)
		if(isNaN(num)){
			console.log("You didnt enter a number!");
			return false;
		}else{
			for(var i=0; i<num; i++){
				let rand = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5) + Math.floor(Math.random()*1000);
				arr.push(rand);
			}
			return arr
		}
	},
	//"buildPQ" - returns either a product price or product quantity array
	buildPQ: function(numP, numQ){
		var arr = []
		if(numP && !numQ){
			for(var i = 0; i<numP; i++){
				arr.push((Math.random()*100).toFixed(2));
			}
		}else if(!numP && numQ){
			for(var i = 0; i<numQ; i++){
				arr.push(Math.round((Math.random()*10 + 1)).toString()); 
			}
		}
		return arr;
	},
	//"buildProdVals" - Builds and returns the object that will be passed in the utag tracking methods.
	// Calls all the functions from above
	// Will return: id, sku, brand, cat, name, quant, 
	buildProdVals: function(num, prodString, prodNum){
		var obj = {};
		if(!prodString && !prodNum){
			
			var prds = ["product_id", "product_sku", "product_brand", "product_category","product_name"]
			
			//function to get order_subtotal
			var getPrice = function(p, q){
				var totalPrice = 0;
				for(var i = 0; i<p.length; i++){
					totalPrice += (p[i] * q[i]);
				}
				return totalPrice.toFixed(2);
			}

			for(var i=0; i < prds.length; i++){
				obj[prds[i]] = orderSim.buildString(num);
			}

			obj.product_quantity = this.buildPQ(null, num);
			obj.product_price = this.buildPQ(num, null);
			obj.order_subtotal = getPrice(obj.product_price, obj.product_quantity);
			obj.order_total = (parseFloat(obj.order_subtotal) + parseFloat(obj.order_subtotal * .08)).toFixed(2);
			obj.order_id = this.buildString(1).toString();

		}else{
			var price = 0;
			for (let i = 0;i<prodString.length;i++){
				obj[prodString[i]] = this.buildString(num);
			}
			for (let i = 0;i<prodNum.length;i++){
				if(prodNum[i].includes("price")){
					obj[prodNum[i]] = this.buildPQ(num);
				}else if (prodNum[i].includes("quan")){
					obj[prodNum[i]] = this.buildPQ(null, num);
				}
			}
			
			obj.order_id = this.buildString(1).toString();
		}
		return obj;
	}		
}

//orderSim.send("view",3,null, {event_name:"test"});

