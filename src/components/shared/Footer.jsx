import { FiChevronDown, FiGlobe } from "react-icons/fi";
import "../../assets/css/footer.css";

const footerColumns = [
	{
		title: "Resources",
		links: [
			"Find A Store",
			"Become A Member",
			"Running Shoe Finder",
			"Nike Coaching",
			"Send Us Feedback",
		],
	},
	{
		title: "Help",
		links: [
			"Get Help",
			"Order Status",
			"Delivery",
			"Returns",
			"Payment Options",
			"Contact Us",
		],
	},
	{
		title: "Company",
		links: [
			"About Nike",
			"News",
			"Careers",
			"Investors",
			"Sustainability",
			"Impact",
			"Report a Concern",
		],
	},
];

function Footer() {
	return (
		<footer className="site-footer">
			<div className="site-footer__top-line" />

			<div className="site-footer__main">
				<div className="site-footer__columns">
					{footerColumns.map((section) => (
						<section key={section.title} className="site-footer__column">
							<h4 className="site-footer__heading">{section.title}</h4>
							<ul className="site-footer__list">
								{section.links.map((link) => (
									<li key={link}>
										<a className="site-footer__link" href="#">
											{link}
										</a>
									</li>
								))}
							</ul>
						</section>
					))}
				</div>

				<button type="button" className="site-footer__locale">
					<FiGlobe />
					<span>Vietnam</span>
				</button>
			</div>

			<div className="site-footer__bottom">
				<p className="site-footer__copyright">© 2026 Nike, Inc. All rights reserved</p>

				<div className="site-footer__meta-links">
					<a href="#" className="site-footer__link site-footer__meta-link">
						Guides <FiChevronDown />
					</a>
					<a href="#" className="site-footer__link site-footer__meta-link">
						Terms of Sale
					</a>
					<a href="#" className="site-footer__link site-footer__meta-link">
						Terms of Use
					</a>
					<a href="#" className="site-footer__link site-footer__meta-link">
						Nike Privacy Policy
					</a>
					<a href="#" className="site-footer__link site-footer__meta-link">
						Privacy Settings
					</a>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
