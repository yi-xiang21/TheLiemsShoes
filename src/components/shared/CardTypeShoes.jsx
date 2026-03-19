import "../../assets/css/type-shoes-card.css";

function CardTypeShoes({ item }) {
	const { image, name } = item;

	return (
		<article className="type-shoes-card">
			<div className="type-shoes-card__image-wrap">
				<img className="type-shoes-card__image" src={image} alt={name} loading="lazy" />
			</div>
			<h3 className="type-shoes-card__name">{name}</h3>
		</article>
	);
}

export default CardTypeShoes;
