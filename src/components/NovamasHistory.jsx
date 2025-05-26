import React from "react";
import "./NovamasHistory.css";

const NovamasHistory = () => {
	return (
		<section className="fashion-tips-section">
			<div className="container">
				<div className="tips-container">
					<div className="tips-content">
						<h2 className="tips-title">NovamaS kroz generacije</h2>
						<div className="tips-list">
							<div className="tip-item">
								<div className="tip-number">25+</div>
								<div className="tip-text">
									<h3>Godina iskustva</h3>
									<p>
										Modna agencija NovamaS djeluje već preko 25 godina.
										Organizovali smo niz prepoznatljivih projekata iz oblasti
										kulture, modne prezentacije za djecu i tinejdđere.
									</p>
								</div>
							</div>

							<div className="tip-item">
								<div className="tip-number">10+</div>
								<div className="tip-text">
									<h3>Modnih projekata</h3>
									<p>
										BH Fashion Week, Hajde budi mi drug, Baščaršijske noći,
										Kupovina sa razlogom, Proljeće u dječijem domu, Dress to
										impress, i mnogi drugi.
									</p>
								</div>
							</div>

							<div className="tip-item">
								<div className="tip-number">∞</div>
								<div className="tip-text">
									<h3>Inspiracija za mališane</h3>
									<p>
										Ispravlja dječije hodanje, oslobađa djecu straha od javnog
										nastupa, uči ih scenskom pokretu i samopouzdanom
										predstavljanju.
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className="tips-image">
						<img
							src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1972&auto=format&fit=crop"
							alt="NovamaS kroz generacije"
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default NovamasHistory;
