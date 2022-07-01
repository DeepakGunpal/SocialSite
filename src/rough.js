if (compareId == -1) {
    arr.push(product1);
  } else {
    arr[compareId].quantity += 1;
    console.log(arr.length)
    cartData.totalItems = arr.length;
    cartData.totalPrice = 0;
    for (let i = 0; i < arr.length; i++) {
      let product = await productModel.findOne({ _id: arr[i].productId });
      cartData.totalPrice += arr[i].quantity * product.price;
    }
  }
  await cartData.save();