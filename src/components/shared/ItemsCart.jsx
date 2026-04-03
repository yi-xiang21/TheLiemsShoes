import { useNavigate } from "react-router-dom";

function ItemsCart({ item, onIncrease, onDecrease, onRemove }) {
	const navigate = useNavigate();
	const handleClickCard = () => {
		navigate(`/product/${item?.productId}`);
	}
	const imageSrc = item?.image || "https://via.placeholder.com/110x110?text=Shoes";

	return (
		<article className="cart-item">
			<div className="cart-item-image-wrap"  onClick={handleClickCard} style={{cursor: "pointer"}}>
				<img src={imageSrc} alt={item?.name || "Product"} className="cart-item-image" />
			</div>

			<div className="cart-item-info"  >
				<h3 onClick={handleClickCard} style={{cursor: "pointer"}}>{item?.name || "Product name"}</h3>
				<p className="cart-item-size">Size {item?.size || "N/A"}</p>
				<p className="cart-item-price">{item?.price || "0 ₫"}</p>
			</div>

			<div className="cart-item-qty">
				<span>Quantity</span>
				<div className="qty-controls">
					<button type="button" className="qty-btn" onClick={onDecrease}>
						-
					</button>
					<div className="qty-box">{item?.quantity || 1}</div>
					<button type="button" className="qty-btn" onClick={onIncrease}>
						+
					</button>
				</div>
				<button type="button" className="remove-item-btn" onClick={onRemove}>
					x
				</button>
			</div>
		</article>
	);
}

export default ItemsCart;
