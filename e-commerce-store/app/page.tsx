"use client"; // We need this for Bootstrap's interactive features like the carousel to work in Next.js

import Link from "next/link";
import { ShieldCheck, Flame, PackageCheck, Wrench } from "lucide-react";
import { useEffect } from "react";
import { useSession } from "next-auth/react"; // 🚀 Import useSession
import { useRouter } from "next/navigation"; // 🚀 Import useRouter

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 🚀 Redirect to dashboard if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js" as any);
  }, []);

  // While checking auth status, show nothing or a loading spinner 
  // so the landing page doesn't "flicker" before redirecting
  if (status === "loading" || status === "authenticated") {
    return <div className="min-vh-100 bg-dark"></div>; 
  }

  return (
    <>
      {/* Navbar */}
      <nav id="navBar" className="navbar navbar-expand-lg navbar-dark sticky-top bg-dark">
        <div className="container">
          <Link className="navbar-brand fw-bold" href="/">Daddys' Store</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav"> 
            <div className="navbar-nav ms-auto">    
              <Link className="nav-link active" href="/">Home</Link>
              <Link className="nav-link" href="#zoids">Zoids</Link>
              <Link className="nav-link" href="#gundams">Gundams</Link>
              <Link className="nav-link" href="#faqs">FAQS</Link>
              <Link className="nav-link btn btn-primary btn-sm ms-lg-3 text-white px-3" href="/login">Login</Link>
              <Link className="nav-link btn btn-primary btn-sm ms-lg-3 text-white px-3" href="/signup">Sign Up</Link>
            </div>  
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section id="hero" className="d-flex align-items-center py-5 bg-secondary text-white">
        <div className="container">
          <div className="row justify-content-center justify-content-md-start">
            <div className="col-lg-8 col-md-10 text-center text-md-start hero-content">
              <h2 id="title" className="display-4 fw-bold">Gundam Haven</h2>
              <p id="title2" className="my-4 fs-5">Elevate your collection—shop now and bring your favorite Gundam to life!</p>
              <Link href="#shop" id="base" className="btn btn-warning btn-lg text-decoration-none fw-bold">Shop Now!</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="heading" className="py-5 bg-dark text-white">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h1 id="text-title" className="mb-4">Why Choose Us?</h1>
              <h3 className="text2 mb-3">🏆 Premium Gunpla Selection</h3>
              <p className="text">We offer an exclusive range of high-quality Gundam model kits for every collector.</p>
              <ul className="text list-unstyled">
                <li className="mb-3 d-flex align-items-start gap-3">
                  <ShieldCheck className="text-success mt-1 shrink-0" size={24} /> 
                  <span><strong>Authenticity Guaranteed</strong> - All our kits are 100% official Bandai products—no bootlegs.</span>
                </li>
                <li className="mb-3 d-flex align-items-start gap-3">
                  <Flame className="text-danger mt-1 shrink-0" size={24} /> 
                  <span><strong>Exclusive Deals</strong> - Enjoy special discounts and pre-order benefits you won’t find elsewhere.</span>
                </li>
                <li className="mb-3 d-flex align-items-start gap-3">
                  <PackageCheck className="text-warning mt-1 shrink-0" size={24} /> 
                  <span><strong>Fast & Secure Shipping</strong> - We ensure safe, well-packaged delivery to protect your Gunpla.</span>
                </li>
                <li className="mb-3 d-flex align-items-start gap-3">
                  <Wrench className="text-info mt-1 shrink-0" size={24} /> 
                  <span><strong>Tools & Accessories</strong> - Nippers, panel liners, and display stands to customize your models.</span>
                </li>
              </ul>
            </div>

            <div className="col-lg-6">
              <div className="card bg-transparent border-0 shadow-lg">
                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-inner rounded shadow">
                    <div className="carousel-item active">
                      <img src="https://www.sideshow.com/cdn-cgi/image/height=850,quality=90,f=auto/https://www.sideshow.com/storage/product-images/906136/strike-freedom-gundam_gundam-seed-destiny_gallery_5e7a969c9e2df.jpg" className="d-block w-100" alt="Freedom" />
                    </div>
                    <div className="carousel-item">
                      <img src="https://tamashiiweb.com/img/tn_blog/20230608_pZLXr39D/01_btyUzVia.jpg" className="d-block w-100" alt="Liger" />
                    </div>
                  </div>
                  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon"></span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                    <span className="carousel-control-next-icon"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="rock-salt-regular mb-5 fw-bold">FEATURED HOT PRODUCTS 🔥</h2>
          <div className="row g-4 justify-content-center">
            {/* Card 1 */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm p-3">
                <img src="https://www.sideshow.com/cdn-cgi/image/height=850,quality=90,f=auto/https://www.sideshow.com/storage/product-images/906136/strike-freedom-gundam_gundam-seed-destiny_gallery_5e7a969c9e2df.jpg" className="card-img-top rounded" alt="Gundam" />
                <div className="card-body">
                  <h5 className="fw-bold">GUNDAM FREEDOM</h5>
                  <p className="small text-muted">High-stakes battles and human evolution. A must-have for Kira Yamato fans.</p>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm p-3">
                <img src="https://tamashiiweb.com/img/tn_blog/20230608_pZLXr39D/01_btyUzVia.jpg" className="card-img-top rounded" alt="Zoids" />
                <div className="card-body">
                  <h5 className="fw-bold">ZOIDS LIGER</h5>
                  <p className="small text-muted">Powerful lion-inspired mecha known for agility and speed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-dark text-light text-center py-4">
        <p className="mb-0">&copy; 2026 Big Daddy Store | Built with Next.js & Prisma</p>
      </footer>
    </>
  );
}