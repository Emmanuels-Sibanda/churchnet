import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, Users, Zap, Shield, 
  Building2, Mic, Search, Calendar, 
  CreditCard, BarChart3 
} from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero">
        <div className="container">
          <h1 className="hero-title">Connect Your Church Network</h1>
          <h2 className="hero-subtitle">Share Venues & Equipment. Build Community. Save Resources.</h2>
          <p className="hero-description">
            The trusted platform for churches to rent and share venues, equipment, and resources within their network. 
            Maximize your church's assets while supporting your community.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary btn-large">Get Started Free</Link>
            <Link to="/venues" className="btn btn-secondary btn-large">Browse Venues</Link>
          </div>
          <p className="hero-note">No credit card required • Free to join • Start listing in minutes</p>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="value-prop">
        <div className="container">
          <div className="value-grid">
            <div className="value-item">
              <div className="value-icon">
                <DollarSign size={48} strokeWidth={1.5} />
              </div>
              <h3>Generate Revenue</h3>
              <p>Turn your unused venues and equipment into income streams for your church</p>
            </div>
            <div className="value-item">
              <div className="value-icon">
                <Users size={48} strokeWidth={1.5} />
              </div>
              <h3>Build Community</h3>
              <p>Connect with churches in your network and strengthen community relationships</p>
            </div>
            <div className="value-item">
              <div className="value-icon">
                <Zap size={48} strokeWidth={1.5} />
              </div>
              <h3>Save Time & Money</h3>
              <p>Find affordable venues and equipment nearby instead of expensive commercial options</p>
            </div>
            <div className="value-item">
              <div className="value-icon">
                <Shield size={48} strokeWidth={1.5} />
              </div>
              <h3>Trusted Network</h3>
              <p>Work exclusively with verified churches in your trusted network</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Everything You Need in One Platform</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Building2 size={48} strokeWidth={1.5} />
              </div>
              <h3>Venue Listings</h3>
              <p>List your church's venues with detailed information about capacity, amenities, and pricing. Set your own rates and availability.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Mic size={48} strokeWidth={1.5} />
              </div>
              <h3>Equipment Rental</h3>
              <p>Rent out audio systems, video equipment, lighting, staging, and more. Or find what you need from other churches.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Search size={48} strokeWidth={1.5} />
              </div>
              <h3>Smart Search</h3>
              <p>Filter by location, capacity, price, and category. Find exactly what you need, when you need it.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Calendar size={48} strokeWidth={1.5} />
              </div>
              <h3>Easy Booking</h3>
              <p>Simple booking system with calendar integration. Request, approve, and manage bookings all in one place.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <CreditCard size={48} strokeWidth={1.5} />
              </div>
              <h3>Flexible Pricing</h3>
              <p>Set hourly or daily rates. Churches set their own prices, keeping costs affordable for everyone.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <BarChart3 size={48} strokeWidth={1.5} />
              </div>
              <h3>Dashboard Management</h3>
              <p>Manage all your listings, bookings, and revenue from a single, easy-to-use dashboard.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Register Your Church</h3>
              <p>Create a free account for your church. It takes less than 2 minutes to get started.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>List or Browse</h3>
              <p>Add your venues and equipment, or browse what's available from other churches in your network.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Book & Connect</h3>
              <p>Request bookings, communicate with other churches, and build lasting community connections.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Grow Together</h3>
              <p>Generate revenue from your assets while helping other churches access the resources they need.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="testimonials">
        <div className="container">
          <h2 className="section-title">Trusted by Churches Nationwide</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                "This platform has been a game-changer for our church. We've generated over R75,000 in revenue from our unused fellowship hall, and it's helped us connect with amazing churches in our area."
              </div>
              <div className="testimonial-author">
                <strong>Pastor John Smith</strong>
                <span>Grace Community Church</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                "Finding affordable audio equipment for our special events used to be a nightmare. Now we can rent from trusted churches nearby at a fraction of the cost. Highly recommend!"
              </div>
              <div className="testimonial-author">
                <strong>Sarah Johnson</strong>
                <span>First Baptist Church</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                "The booking system is so simple, and we love being able to help other churches while earning extra income. It's a win-win for everyone in our network."
              </div>
              <div className="testimonial-author">
                <strong>Michael Chen</strong>
                <span>New Life Church</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Churches Connected</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1,200+</div>
              <div className="stat-label">Venues Listed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">3,500+</div>
              <div className="stat-label">Equipment Items</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Successful Bookings</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Join hundreds of churches already using our platform to share resources and build community.</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary btn-large">Create Free Account</Link>
            <Link to="/venues" className="btn btn-secondary btn-large">Explore Venues</Link>
          </div>
          <p className="cta-note">Free to join • No setup fees • Start listing today</p>
        </div>
      </div>
    </div>
  );
};

export default Home;

