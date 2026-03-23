import { useNavigate } from "react-router-dom";
import "../../assets/css/product-card.css";

function CardProducts({id, image, name, category, price }) {
	const navigate = useNavigate();
	const handleCardClick = () => {
		navigate(`/product/${id}`);
	};
	const formattedPrice = new Intl.NumberFormat("vi-VN").format(price ?? 0);

	return (
		<article className="product-card" data_product-id={id} onClick={handleCardClick} style={{cursor: "pointer"}}>
			<div className="product-card__image-wrap">
				<img className="product-card__image" src={image} alt={name} loading="lazy" />
			</div>

			<div className="product-card__content">
				<h3 className="product-card__title">{name}</h3>
				<p className="product-card__category">{category}</p>
				<p className="product-card__price">
					{formattedPrice}
					<span className="product-card__currency">đ</span>
				</p>    
			</div>
		</article>
	);
}

export default CardProducts;
