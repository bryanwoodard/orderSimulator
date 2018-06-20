/*
version 1.0 - Stable and working based on predefined product values 
To be included in later versions:
	- send order based on load rule
	- define client specific product vars
	- send order based on tag#
*/

/*Random Order value generator
	Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5) + Math.floor(Math.random()*1000)
hats

*/



window.orderSim = window.orderSim || {
	send: function(type, prodNum, loadRule, specificProductValuesArray){
		if ((type == "link" || type == "view") && !isNaN(prodNum)){
			var obj = this.buildProdVals(prodNum) // change all "orderSim" to this
			utag[type](obj);
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
			return arr;
		}else if(!numP && numQ){
			for(var i = 0; i<numQ; i++){
				arr.push(Math.round((Math.random()*10 + 1)).toString()); 
			}
			return arr;
		}
		
	},
	buildProdVals: function(num, prodVals){
		if(!prodVals){
			var obj = {};
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
			return obj;
		}else{
			//do something with the specific product array values
		}
	}		
}