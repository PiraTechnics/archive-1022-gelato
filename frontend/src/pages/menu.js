import * as React from "react";
import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Row, Col } from "react-bootstrap";
import Layout from "../components/layout";
import Seo from "../components/seo";

const MenuPage = ({ data }) => {
	const menuImg = getImage(data.strapiPage.image.localFile.childImageSharp);
	const altText = data.strapiPage.image.alternativeText;
	const menuHeader = data.strapiPage.header;

	const menuTypes = data.allStrapiItemType.edges;
	const menuItems = data.allStrapiMenuItem.edges;

	//local currency
	let USDollar = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	});

	return (
		<Layout>
			<Row className="position-relative">
				<GatsbyImage image={menuImg} alt={altText} />
				{/* 				<h1 className="position-absolute top-50 start-50 translate-middle text-center">
					{menuHeader}
				</h1> */}
			</Row>
			<Row>
				<h3 className="text-center font-monospace mt-3">{menuHeader}</h3>
				<Col>
					<hr className="border-2 mx-5" />
				</Col>
			</Row>
			{React.Children.toArray(
				menuTypes.map((type) => {
					return (
						<Row className="mb-5 pb-2">
							<h5 className="text-center font-monospace text-decoration-underline pb-3">
								{type.node.name}
							</h5>
							{React.Children.toArray(
								menuItems.map((item) => {
									if (item.node.item_type.name === type.node.name) {
										//matching type, render it
										return (
											<Col xs={6} className="text-center menu-item">
												<span className="text-decoration-underline">
													{item.node.name}
												</span>
												<span style={{ fontSize: ".75em" }}>
													{item.node.vegan && " (V)"}
													{item.node.gluten_free && " (GF)"}
												</span>
												<div>{USDollar.format(item.node.price)}</div>
											</Col>
										);
									} else {
										//Not matching type, skip it
										return <></>;
									}
								})
							)}
						</Row>
					);
				})
			)}
		</Layout>
	);
};

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Menu" />;

export default MenuPage;

export const pageQuery = graphql`
	query {
		strapiPage(name: { eq: "Menu" }) {
			name
			header
			image {
				alternativeText
				localFile {
					childImageSharp {
						gatsbyImageData
					}
				}
			}
		}
		allStrapiMenuItem {
			edges {
				node {
					id
					name
					detail
					price
					item_type {
						name
					}
					vegan
					gluten_free
				}
			}
		}
		allStrapiItemType {
			edges {
				node {
					id
					name
				}
			}
		}
	}
`;
