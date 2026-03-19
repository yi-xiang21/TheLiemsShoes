import "../../assets/css/category-card.css";

function CardCategorys({ id, name }) {

	return (
		<article className="category-card" data-category-id={id}>
			<h3 className="category-card__name">{name}</h3>
		</article>
	);
}

export default CardCategorys;
