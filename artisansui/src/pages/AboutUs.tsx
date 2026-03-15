import React from "react";
import artisanImage from "../assets/artisan-crafts.jpg";
import ourMissionImage from "../assets/our_mission.jpg";
const AboutUs: React.FC = () => {
  return (
    <div style={{ background: "#fff7f2", fontFamily: "Inter, sans-serif" }}>
      {/* HERO */}

      <section
        style={{
          height: "400px",
          backgroundImage: `url(${artisanImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* <div
          style={{
            background: "rgba(0,0,0,0.45)",
            padding: "40px",
            borderRadius: "12px",
            color: "white",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "40px", marginBottom: "10px" }}>
            Empowering Artisans
          </h1>

          <p style={{ maxWidth: "550px", lineHeight: "1.6" }}>
            Our platform connects talented artisans with global customers,
            preserving traditional craftsmanship while creating sustainable
            livelihoods.
          </p>
        </div> */}
      </section>

      {/* OUR STORY */}

      <section
        style={{
          maxWidth: "1100px",
          margin: "auto",
          padding: "60px 20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ marginBottom: "15px" }}>Our Mission</h2>

            <p
              style={{ color: "#555", marginBottom: "12px", lineHeight: "1.6" }}
            >
              Across rural communities, artisans carry centuries-old traditions
              like weaving, pottery, embroidery, and metalwork.
            </p>

            <p style={{ color: "#555", lineHeight: "1.6" }}>
              Our mission is to empower these artisans by providing a digital
              platform where their handcrafted products can reach customers
              worldwide.
            </p>
          </div>

          <img
            src={`${ourMissionImage}`}
            alt="artisan"
            style={{
              width: "100%",
              borderRadius: "14px",
              objectFit: "cover",
            }}
          />
        </div>
      </section>

      {/* IMPACT */}

      {/* <section
        style={{
          background: "white",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h2>Our Impact</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: "30px",
            maxWidth: "900px",
            margin: "40px auto",
          }}
        >
          <div
            style={{
              background: "#fff7f2",
              padding: "30px",
              borderRadius: "14px",
            }}
          >
            <h3 style={{ color: "#c2410c", fontSize: "32px" }}>500+</h3>
            <p>Artisans Supported</p>
          </div>

          <div
            style={{
              background: "#fff7f2",
              padding: "30px",
              borderRadius: "14px",
            }}
          >
            <h3 style={{ color: "#c2410c", fontSize: "32px" }}>2000+</h3>
            <p>Handcrafted Products</p>
          </div>

          <div
            style={{
              background: "#fff7f2",
              padding: "30px",
              borderRadius: "14px",
            }}
          >
            <h3 style={{ color: "#c2410c", fontSize: "32px" }}>50+</h3>
            <p>Craft Traditions</p>
          </div>

          <div
            style={{
              background: "#fff7f2",
              padding: "30px",
              borderRadius: "14px",
            }}
          >
            <h3 style={{ color: "#c2410c", fontSize: "32px" }}>20+</h3>
            <p>Regions Represented</p>
          </div>
        </div>
      </section> */}

      {/* VALUES */}

      <section
        style={{
          maxWidth: "1100px",
          margin: "auto",
          padding: "60px 20px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "40px" }}>
          Our Values
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
            gap: "30px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
            }}
          >
            <h4>Fair Trade</h4>
            <p>Ensuring artisans receive fair compensation.</p>
          </div>

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
            }}
          >
            <h4>Cultural Preservation</h4>
            <p>Supporting traditional crafts and heritage.</p>
          </div>

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
            }}
          >
            <h4>Sustainable Craft</h4>
            <p>Promoting eco-friendly handmade production.</p>
          </div>
        </div>
      </section>

      {/* CTA */}

      <section
        style={{
          background: "#c2410c",
          color: "white",
          textAlign: "center",
          padding: "70px 20px",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>Support Artisan Communities</h2>

        <p style={{ maxWidth: "500px", margin: "auto" }}>
          Every purchase you make helps artisans continue their craft and build
          better futures for their families.
        </p>

        <button
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            border: "none",
            background: "white",
            color: "#c2410c",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Explore Products
        </button>
      </section>
    </div>
  );
};

export default AboutUs;
