import {
  useLoaderData,
  useSearchParams,
  useNavigation,
} from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Province {
  id: number;
  name: string;
}

interface Regency {
  id: number;
  name: string;
  province_id: number;
}

interface District {
  id: number;
  name: string;
  regency_id: number;
}

interface RegionData {
  provinces: Province[];
  regencies: Regency[];
  districts: District[];
}

// ─── Loader ───────────────────────────────────────────────────────────────────

export async function loader(): Promise<RegionData> {
  const res = await fetch("/indonesia-regions-filter/data/indonesia_regions.json");
  if (!res.ok) throw new Error("Failed to load region data.");
  return res.json();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SelectField({
  label,
  name,
  value,
  options,
  disabled,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  options: { id: number; name: string }[];
  disabled: boolean;
  onChange: (val: string) => void;
}) {
  return (
    <div className="mb-5">
      <label
        htmlFor={name}
        className="block text-[11px] font-semibold tracking-widest uppercase mb-2"
        style={{ color: disabled ? "#94a3b8" : "#64748b" }}
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border px-4 py-3 pr-10 text-sm font-medium transition-all duration-200 outline-none"
          style={{
            background: disabled ? "#f8fafc" : "#ffffff",
            borderColor: disabled ? "#e2e8f0" : value ? "#6366f1" : "#cbd5e1",
            color: disabled ? "#94a3b8" : value ? "#1e1b4b" : "#64748b",
            cursor: disabled ? "not-allowed" : "pointer",
            boxShadow: value && !disabled
              ? "0 0 0 3px rgba(99,102,241,0.12)"
              : "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <option value="">Select {label}…</option>
          {options.map((opt) => (
            <option key={opt.id} value={String(opt.id)}>
              {opt.name}
            </option>
          ))}
        </select>
        {/* Chevron icon */}
        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          style={{ color: disabled ? "#cbd5e1" : "#6366f1" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function FilterPage() {
  const data = useLoaderData() as RegionData;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const provinceId = searchParams.get("province") ?? "";
  const regencyId = searchParams.get("regency") ?? "";
  const districtId = searchParams.get("district") ?? "";

  // Derived selections
  const selectedProvince = data.provinces.find(
    (p) => String(p.id) === provinceId
  );
  const selectedRegency = data.regencies.find(
    (r) => String(r.id) === regencyId
  );
  const selectedDistrict = data.districts.find(
    (d) => String(d.id) === districtId
  );

  // Filtered options
  const filteredRegencies = data.regencies.filter(
    (r) => String(r.province_id) === provinceId
  );
  const filteredDistricts = data.districts.filter(
    (d) => String(d.regency_id) === regencyId
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleProvinceChange = (val: string) => {
    setSearchParams(val ? { province: val } : {});
  };

  const handleRegencyChange = (val: string) => {
    const next: Record<string, string> = { province: provinceId };
    if (val) next.regency = val;
    setSearchParams(next);
  };

  const handleDistrictChange = (val: string) => {
    const next: Record<string, string> = {
      province: provinceId,
      regency: regencyId,
    };
    if (val) next.district = val;
    setSearchParams(next);
  };

  const handleReset = () => setSearchParams({});

  const isLoading = navigation.state === "loading";

  // ── Breadcrumb items ───────────────────────────────────────────────────────
  const crumbs = [
    "Indonesia",
    selectedProvince?.name,
    selectedRegency?.name,
    selectedDistrict?.name,
  ].filter(Boolean) as string[];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #f0f4ff 0%, #fafafa 60%, #f5f3ff 100%)",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      {/* Top Bar */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-8 py-4"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(99,102,241,0.1)",
        }}
      >
        <div className="flex items-center gap-3">
          {/* Map pin icon */}
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"
                fill="white"
              />
            </svg>
          </span>
          <div>
            <h1 className="text-base font-bold" style={{ color: "#1e1b4b", letterSpacing: "-0.02em" }}>
              Nusantara Explorer
            </h1>
            <p className="text-[11px]" style={{ color: "#94a3b8" }}>
              Indonesian Region Browser
            </p>
          </div>
        </div>

        {/* Breadcrumb in header */}
        {crumbs.length > 1 && (
          <nav className="breadcrumb hidden md:flex items-center gap-1.5 text-xs" style={{ color: "#64748b" }}>
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M4 2l4 4-4 4" stroke="#c7d2fe" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <span
                  className="font-medium"
                  style={{ color: i === crumbs.length - 1 ? "#6366f1" : "#64748b" }}
                >
                  {c}
                </span>
              </span>
            ))}
          </nav>
        )}
      </header>

      {/* Body */}
      <div className="flex min-h-[calc(100vh-65px)]">
        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <aside
          className="w-72 shrink-0 px-6 py-8"
          style={{
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
            borderRight: "1px solid rgba(99,102,241,0.1)",
          }}
        >
          <div className="mb-8">
            <p
              className="text-[10px] font-bold tracking-widest uppercase mb-1"
              style={{ color: "#6366f1" }}
            >
              Filter Regions
            </p>
            <h2 className="text-lg font-bold" style={{ color: "#1e1b4b", letterSpacing: "-0.02em" }}>
              Narrow your search
            </h2>
          </div>

          <SelectField
            label="Province"
            name="province"
            value={provinceId}
            options={data.provinces}
            disabled={false}
            onChange={handleProvinceChange}
          />
          <SelectField
            label="Regency / City"
            name="regency"
            value={regencyId}
            options={filteredRegencies}
            disabled={!provinceId}
            onChange={handleRegencyChange}
          />
          <SelectField
            label="District"
            name="district"
            value={districtId}
            options={filteredDistricts}
            disabled={!regencyId}
            onChange={handleDistrictChange}
          />

          {/* Reset button */}
          {(provinceId || regencyId || districtId) && (
            <button
              onClick={handleReset}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95"
              style={{
                background: "rgba(99,102,241,0.08)",
                color: "#6366f1",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(99,102,241,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(99,102,241,0.08)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 7a6 6 0 1 0 6-6 6 6 0 0 0-4.24 1.76L1 1m0 0v3h3"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Reset Filters
            </button>
          )}

          {/* Stats panel */}
          <div
            className="mt-8 rounded-xl p-4"
            style={{ background: "linear-gradient(135deg,#eef2ff,#f5f3ff)", border: "1px solid #e0e7ff" }}
          >
            <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "#818cf8" }}>
              Dataset
            </p>
            {[
              { label: "Provinces", val: data.provinces.length },
              { label: "Regencies", val: data.regencies.length },
              { label: "Districts", val: data.districts.length },
            ].map(({ label, val }) => (
              <div key={label} className="flex justify-between items-center mb-2">
                <span className="text-xs" style={{ color: "#64748b" }}>
                  {label}
                </span>
                <span
                  className="text-xs font-bold tabular-nums px-2 py-0.5 rounded-full"
                  style={{ background: "white", color: "#6366f1" }}
                >
                  {val.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────────────────────────────── */}
        <main
          className="flex-1 px-10 py-10"
          style={{ opacity: isLoading ? 0.5 : 1, transition: "opacity 0.2s" }}
        >
          {/* Breadcrumb for mobile */}
          <nav className="breadcrumb md:hidden flex items-center gap-1.5 text-xs mb-6" style={{ color: "#64748b" }}>
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span style={{ color: "#c7d2fe" }}>›</span>}
                <span
                  className="font-medium"
                  style={{ color: i === crumbs.length - 1 ? "#6366f1" : "#64748b" }}
                >
                  {c}
                </span>
              </span>
            ))}
          </nav>

          {/* Empty state */}
          {!selectedProvince && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div
                className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl"
                style={{ background: "linear-gradient(135deg,#eef2ff,#f5f3ff)" }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"
                    fill="#a5b4fc"
                  />
                </svg>
              </div>
              <h3
                className="text-2xl font-bold mb-2"
                style={{ color: "#1e1b4b", letterSpacing: "-0.03em" }}
              >
                Select a Province
              </h3>
              <p className="text-sm max-w-xs" style={{ color: "#94a3b8", lineHeight: 1.7 }}>
                Use the sidebar filters to explore provinces, regencies, and districts across Indonesia.
              </p>
            </div>
          )}

          {/* Region hierarchy display */}
          {selectedProvince && (
            <div>
              <p
                className="text-[10px] font-bold tracking-widest uppercase mb-8"
                style={{ color: "#6366f1" }}
              >
                Selected Region
              </p>

              <div className="flex flex-col gap-0">
                {/* Province card */}
                <RegionCard
                  level="Province"
                  name={selectedProvince.name}
                  color="#6366f1"
                  bg="linear-gradient(135deg,#eef2ff 0%,#e0e7ff 100%)"
                  index={0}
                />

                {selectedRegency && (
                  <>
                    <HierarchyArrow />
                    <RegionCard
                      level="Regency / City"
                      name={selectedRegency.name}
                      color="#7c3aed"
                      bg="linear-gradient(135deg,#f5f3ff 0%,#ede9fe 100%)"
                      index={1}
                    />
                  </>
                )}

                {selectedDistrict && (
                  <>
                    <HierarchyArrow />
                    <RegionCard
                      level="District"
                      name={selectedDistrict.name}
                      color="#9333ea"
                      bg="linear-gradient(135deg,#faf5ff 0%,#f3e8ff 100%)"
                      index={2}
                    />
                  </>
                )}
              </div>

              {/* Prompt to select more */}
              {!selectedRegency && (
                <div
                  className="mt-6 rounded-xl px-5 py-4 flex items-center gap-3 text-sm"
                  style={{ background: "rgba(99,102,241,0.06)", border: "1px dashed #c7d2fe" }}
                >
                  <span style={{ color: "#818cf8" }}>↓</span>
                  <span style={{ color: "#64748b" }}>
                    Select a <strong style={{ color: "#6366f1" }}>Regency or City</strong> to drill deeper
                  </span>
                </div>
              )}
              {selectedRegency && !selectedDistrict && (
                <div
                  className="mt-6 rounded-xl px-5 py-4 flex items-center gap-3 text-sm"
                  style={{ background: "rgba(124,58,237,0.06)", border: "1px dashed #ddd6fe" }}
                >
                  <span style={{ color: "#a78bfa" }}>↓</span>
                  <span style={{ color: "#64748b" }}>
                    Select a <strong style={{ color: "#7c3aed" }}>District</strong> to see the full path
                  </span>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function RegionCard({
  level,
  name,
  color,
  bg,
  index,
}: {
  level: string;
  name: string;
  color: string;
  bg: string;
  index: number;
}) {
  return (
    <div
      className="rounded-2xl px-8 py-7 flex items-center gap-6"
      style={{
        background: bg,
        border: `1.5px solid ${color}22`,
        marginLeft: `${index * 24}px`,
        boxShadow: `0 4px 20px ${color}14`,
        animation: "fadeSlideIn 0.35s ease both",
        animationDelay: `${index * 0.07}s`,
      }}
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white text-lg font-bold"
        style={{ background: `linear-gradient(135deg,${color},${color}cc)` }}
      >
        {index === 0 ? "P" : index === 1 ? "R" : "D"}
      </div>
      <div>
        <p
          className="text-[10px] font-bold tracking-widest uppercase mb-0.5"
          style={{ color: `${color}aa` }}
        >
          {level}
        </p>
        <p
          className="text-2xl font-black leading-tight"
          style={{ color: "#1e1b4b", letterSpacing: "-0.03em" }}
        >
          {name}
        </p>
      </div>
    </div>
  );
}

function HierarchyArrow() {
  return (
    <div className="flex items-center gap-3 my-3 ml-10">
      <div
        className="h-8 w-px mx-6"
        style={{ background: "linear-gradient(to bottom,#c7d2fe,#ddd6fe)" }}
      />
      <span className="text-xl" style={{ color: "#c7d2fe" }}>↓</span>
    </div>
  );
}
