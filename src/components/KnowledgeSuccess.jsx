import React from "react";
import "./KnowledgeSuccess.css";

const KnowledgeSuccess = () => {
	return (
		<section className="inspiration-section">
			<div className="container">
				<div className="section-header">
					<h2 className="section-title">Znanje za uspjeh</h2>
					<div className="section-line"></div>
				</div>

				<div className="inspiration-grid">
					<div className="inspiration-item">
						<h3>Znanje za uspjeh</h3>
						<p>
							U pozitivnom okruženju, igri, prijateljstvu i ljubavi stvaramo
							dobre šanse i mogućnosti da svi zajedno budemo bolji, sretniji i
							zdraviji.
						</p>
					</div>

					<div className="inspiration-item">
						<h3>Stav za uspjeh</h3>
						<p>
							Želimo biti moderni u drugom smislu – da su naša djeca zdrava,
							vesela i kreativna, sa znanjem i mogućnostima koje predstavljamo.
						</p>
					</div>

					<div className="inspiration-item">
						<h3>Pokret za uspjeh</h3>
						<p>
							Djeca zaslužuju najbolje. Kroz naš rad potičemo zdravlje, veselje
							i kreativnost, kao temelje za budućnost.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default KnowledgeSuccess;
