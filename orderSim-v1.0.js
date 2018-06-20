/*
version 1.1
To be included in next release:
	- optimize code, let redundancies
	- 
*/

window.orderSim = window.orderSim || {
	send: function(type, prodNum, tagArray, objJoin, specProdStrings, specProdNums ){
		if ((type == "link" || type == "view") && !isNaN(prodNum)){
			var obj = this.buildProdVals(prodNum, specProdStrings, specProdNums) // changed to allow for specific prod values
			if(objJoin){
				Object.assign(obj, objJoin);
			}
			utag[type](obj,null,tagArray);
		}else{
			console.log("Invalid utag tracking method");
		}
		//Nothing done for 3rd and 4th params yet
	},
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
	},buildPQ: function(numP, numQ){
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
	buildProdVals: function(num, prodString, prodNum){
		var obj = {};
		if(!prodString && !prodNum){
			
			var prds = ["product_id", "product_sku", "product_brand", "product_category","product_name"]
			
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
			//return obj;
		}else{
			// finish here!!!!!!not  complete func,
			// How can we determine prod quant and price values
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
			for(thing in obj){
				// something with obj
			}
			obj.order_id = this.buildString(1).toString();
			//add functionaliy to include subtotal, total and way to dynamically set these vals 
			//return obj;
		}
		return obj;
	}		
}