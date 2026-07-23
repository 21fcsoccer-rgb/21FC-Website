const GlyphClub = () => (
  <>
    <path className="glyph-panel" d="M32 5 53 13v18c0 13.8-8.4 24.2-21 29-12.6-4.8-21-15.2-21-29V13L32 5Z" />
    <path className="glyph-line" d="M18 18 32 12l14 6v13c0 9.8-5.4 17.2-14 21-8.6-3.8-14-11.2-14-21V18Z" />
    <path className="glyph-accent" d="M24 39h16" />
    <text x="32" y="34" textAnchor="middle">21</text>
  </>
);

const GlyphFixture = () => (
  <>
    <rect className="glyph-panel" x="12" y="13" width="40" height="40" rx="6" />
    <path className="glyph-line" d="M12 25h40M22 10v8M42 10v8" />
    <path className="glyph-accent" d="M21 36h22" />
    <text x="32" y="48" textAnchor="middle">7A</text>
  </>
);

const GlyphGallery = () => (
  <>
    <rect className="glyph-panel" x="10" y="17" width="44" height="34" rx="6" />
    <path className="glyph-line" d="M22 17l4-6h12l4 6" />
    <circle className="glyph-accent-fill" cx="32" cy="34" r="9" />
    <circle className="glyph-line" cx="32" cy="34" r="4" />
  </>
);

const GlyphSocial = () => (
  <>
    <rect className="glyph-panel" x="20" y="7" width="24" height="50" rx="7" />
    <path className="glyph-line" d="M28 13h8M29 51h6" />
    <path className="glyph-accent-fill" d="M29 27v12l10-6-10-6Z" />
  </>
);

const GlyphMembership = () => (
  <>
    <path className="glyph-panel" d="M32 7 52 16v17c0 12-8 21-20 25-12-4-20-13-20-25V16L32 7Z" />
    <path className="glyph-accent" d="m22 26 5-7 5 7 5-7 5 7" />
    <circle className="glyph-line" cx="32" cy="38" r="9" />
    <path className="glyph-line" d="M32 29v18M23 38h18" />
  </>
);

const GlyphContact = () => (
  <>
    <path className="glyph-panel" d="M12 16h40v27H28L18 51v-8h-6V16Z" />
    <path className="glyph-accent" d="M22 27h20M22 36h14" />
  </>
);

const GlyphLocation = () => (
  <>
    <path className="glyph-panel" d="M32 58S16 46 16 28a16 16 0 0 1 32 0c0 18-16 30-16 30Z" />
    <circle className="glyph-line" cx="32" cy="28" r="7" />
    <path className="glyph-accent" d="M22 58h20" />
  </>
);

const GlyphCommunity = () => (
  <>
    <circle className="glyph-panel" cx="23" cy="27" r="9" />
    <circle className="glyph-panel" cx="41" cy="27" r="9" />
    <path className="glyph-line" d="M12 52c2-9 8-14 16-14M52 52c-2-9-8-14-16-14" />
    <path className="glyph-accent" d="M23 51h18" />
  </>
);

const glyphs = {
  club: GlyphClub,
  fixture: GlyphFixture,
  gallery: GlyphGallery,
  social: GlyphSocial,
  membership: GlyphMembership,
  contact: GlyphContact,
  location: GlyphLocation,
  community: GlyphCommunity,
};

export const BrandGlyph = ({ type = 'club', className = '' }) => {
  const Glyph = glyphs[type] || GlyphClub;
  return (
    <svg className={`brand-glyph brand-glyph-${type} ${className}`} viewBox="0 0 64 64" aria-hidden="true">
      <Glyph />
    </svg>
  );
};

export const SectionBadge = ({ icon = 'club', children }) => (
  <div className="section-badge">
    <span className="section-badge-icon"><BrandGlyph type={icon} /></span>
    <span>{children}</span>
  </div>
);
