import React, { useState } from 'react';
import { X, Upload, Camera, MapPin, Sparkles, Check, Image as ImageIcon } from 'lucide-react';
import { Animal, Language, ZoneId, ConservationStatus, DietType } from '../types';
import { soundManager } from '../utils/audio';

interface AddPhotoModalProps {
  lang: Language;
  onClose: () => void;
  onAddAnimal: (newAnimal: Animal) => void;
}

export const AddPhotoModal: React.FC<AddPhotoModalProps> = ({ lang, onClose, onAddAnimal }) => {
  const [nameId, setNameId] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [zoneId, setZoneId] = useState<ZoneId>('rainforest');
  const [status, setStatus] = useState<ConservationStatus>('LC');
  const [diet, setDiet] = useState<DietType>('herbivore');
  const [photographer, setPhotographer] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [funFact, setFunFact] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [cameraModel, setCameraModel] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      setImageUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl || !nameId) return;

    soundManager.playCameraShutter();

    const newAnimal: Animal = {
      id: `user_${Date.now()}`,
      name: {
        id: nameId,
        en: nameEn || nameId,
      },
      scientificName: scientificName || 'Fauna incognita',
      emoji: '📸',
      zoneId,
      diet,
      status,
      statusLabel: {
        id: status === 'CR' ? 'Kritis' : status === 'EN' ? 'Terancam' : 'Risiko Rendah',
        en: status === 'CR' ? 'Critically Endangered' : status === 'EN' ? 'Endangered' : 'Least Concern',
      },
      imageUrl: imagePreview || imageUrl,
      habitat: {
        id: location || 'Habitat Alami',
        en: location || 'Natural Habitat',
      },
      origin: {
        id: location || 'Dunia Liar',
        en: location || 'Wild Habitat',
      },
      lifespan: '10 - 20 Tahun',
      weight: 'Bervariasi',
      speed: 'Alami',
      description: {
        id: description || 'Potret satwa liar yang ditambahkan oleh penjelajah album.',
        en: description || 'Wildlife photograph contributed to the personal album archive.',
      },
      funFacts: {
        id: [funFact || 'Satwa ini didokumentasikan dan diabadikan dalam album fotografi alam.'],
        en: [funFact || 'This animal was documented and preserved in the natural photo album.'],
      },
      feedingTime: '12:00',
      favoriteFood: {
        id: 'Makanan Alami',
        en: 'Natural Diet',
        icon: '🌿',
      },
      soundType: 'bird',
      photographer: photographer || 'Penjelajah Satwa',
      photoLocation: {
        id: location || 'Suaka Alam',
        en: location || 'Wildlife Sanctuary',
      },
      photoYear: new Date().getFullYear().toString(),
      cameraDetails: {
        camera: cameraModel || 'Mirrorless Pro',
        lens: 'Telephoto Zoom',
        shutter: '1/1000s',
        aperture: 'f/4.0',
        iso: 'ISO 200',
      },
      isUserUploaded: true,
    };

    onAddAnimal(newAnimal);
    soundManager.playSuccessChime();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full p-4 sm:p-8 shadow-2xl relative animate-scale-up my-auto max-h-[92vh] overflow-y-auto scrollbar-thin">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif]">
              {lang === 'id' ? 'Tambah Foto Satwa ke Album' : 'Add Wildlife Photo to Album'}
            </h2>
            <p className="text-xs text-stone-400">
              {lang === 'id'
                ? 'Unggah foto satwa dan simpan ke galeri album pribadi Anda'
                : 'Upload an animal photo and save it to your personal wildlife album'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Dropzone / File Picker */}
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-2">
              {lang === 'id' ? 'Unggah Foto Satwa *' : 'Upload Animal Photo *'}
            </label>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                dragActive
                  ? 'border-amber-400 bg-amber-400/10'
                  : 'border-stone-700 hover:border-stone-500 bg-stone-950/60'
              }`}
            >
              {imagePreview ? (
                <div className="relative aspect-video max-h-48 mx-auto rounded-xl overflow-hidden group">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer px-4 py-2 bg-amber-400 text-stone-950 font-bold rounded-xl text-xs">
                      {lang === 'id' ? 'Ganti Foto' : 'Change Photo'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
                  <p className="text-xs text-stone-300 font-semibold">
                    {lang === 'id' ? 'Tarik & lepas foto di sini, atau' : 'Drag & drop photo here, or'}
                  </p>
                  <label className="inline-block cursor-pointer px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-xl text-xs font-bold border border-stone-700 transition-colors">
                    {lang === 'id' ? 'Pilih Dari File' : 'Browse Local Files'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-stone-500">JPG, PNG, WebP (Maks 10MB)</p>
                </div>
              )}
            </div>

            {/* Alternative URL Input */}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] text-stone-500">atau URL:</span>
              <input
                type="url"
                value={imageUrl.startsWith('data:') ? '' : imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImagePreview(e.target.value);
                }}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-1.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-300 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Grid fields: Names & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">
                {lang === 'id' ? 'Nama Satwa (Bahasa Indonesia) *' : 'Animal Name (ID) *'}
              </label>
              <input
                type="text"
                required
                value={nameId}
                onChange={(e) => setNameId(e.target.value)}
                placeholder="Contoh: Macan Tutul Salju"
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">
                {lang === 'id' ? 'Nama Satwa (Bahasa Inggris)' : 'Animal Name (EN)'}
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="Example: Snow Leopard"
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">
                {lang === 'id' ? 'Nama Ilmiah (Latin)' : 'Scientific Name'}
              </label>
              <input
                type="text"
                value={scientificName}
                onChange={(e) => setScientificName(e.target.value)}
                placeholder="Example: Panthera uncia"
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">
                {lang === 'id' ? 'Kategori Habitat / Zona' : 'Habitat Biome'}
              </label>
              <select
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value as ZoneId)}
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="sabana">🦁 Sabana Afrika</option>
                <option value="rainforest">🦧 Hutan Hujan Tropis</option>
                <option value="arctic">❄️ Kutub Salju & Tundra</option>
                <option value="ocean">🐬 Samudra & Pesisir</option>
                <option value="aviary">🦅 Kubah Burung Langit</option>
                <option value="reptile">🐊 Reptil Purba</option>
              </select>
            </div>
          </div>

          {/* Photo Metadata: Photographer & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">
                {lang === 'id' ? 'Fotografer' : 'Photographer'}
              </label>
              <input
                type="text"
                value={photographer}
                onChange={(e) => setPhotographer(e.target.value)}
                placeholder="Nama Anda atau Fotografer"
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">
                {lang === 'id' ? 'Lokasi Potret' : 'Photo Location'}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Pegunungan Himalaya"
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Story / Description */}
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1">
              {lang === 'id' ? 'Catatan Cerita Satwa' : 'Animal Story / Notes'}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                lang === 'id'
                  ? 'Ceritakan tentang perjumpaan atau keunikan satwa ini...'
                  : 'Describe this wildlife encounter or animal facts...'
              }
              className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          {/* Submit buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-colors"
            >
              {lang === 'id' ? 'Batal' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={!imagePreview && !imageUrl}
              className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 text-xs font-extrabold shadow-lg shadow-amber-950/40 transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{lang === 'id' ? 'Simpan ke Album' : 'Save to Album'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
