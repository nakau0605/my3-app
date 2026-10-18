'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Palette, 
  Search, 
  Check, 
  Eye, 
  Edit3, 
  Crown, 
  UploadCloud,
  ArrowRight,
  ArrowLeft,
  Type,
  Lock,
  Layers,
  ShoppingBag
} from 'lucide-react';
import { My3Item, ThemeId } from '@/types';
import ProModal from '@/components/ProModal';
import Icon from '@/components/Icon';

// 有料プラン（Pro）で選べる5つの洗練フォント
const FONT_OPTIONS = [
  { 
    id: 'gothic', 
    name: 'モダン・ゴシック', 
    sub: '標準・クリーン',
    family: "'Zen Kaku Gothic New', -apple-system, sans-serif",
    sample: '偏愛の3選が、誰かの買い物になる。'
  },
  { 
    id: 'mincho', 
    name: 'エレガント・明朝', 
    sub: '雑誌・高級感',
    family: "'Shippori Mincho', serif",
    sample: '偏愛の3選が、誰かの買い物になる。'
  },
  { 
    id: 'rounded', 
    name: '丸ゴシック', 
    sub: 'ポップ・親しみ',
    family: "'Zen Maru Gothic', sans-serif",
    sample: '偏愛の3選が、誰かの買い物になる。'
  },
  { 
    id: 'craft', 
    name: 'クラフト・手書き風', 
    sub: '温もり・こだわり',
    family: "'Kaisei Decol', serif",
    sample: '偏愛の3選が、誰かの買い物になる。'
  },
  { 
    id: 'mono', 
    name: 'テック・等幅', 
    sub: '機能美・ガジェット',
    family: "'JetBrains Mono', monospace",
    sample: '偏愛の3選が、誰かの買い物になる。'
  },
];

// 無料プランの3色プリセット（白・黒・ベージュ）
const FREE_COLOR_PRESETS = [
  {
    id: 'white',
    name: 'クリーン・白',
    bg: '#F8F9FD',
    card: '#FFFFFF',
    text: '#1C1C1E',
    border: '#E2E8F0',
  },
  {
    id: 'black',
    name: 'スリーク・黒',
    bg: '#111827',
    card: '#1F2937',
    text: '#F9FAFB',
    border: '#374151',
  },
  {
    id: 'beige',
    name: 'ナチュラル・ベージュ',
    bg: '#FAF5EE',
    card: '#FFFFFF',
    text: '#2C2623',
    border: '#E8DFD3',
  },
];

// 有料プラン（Pro）の厳選七色プリセット
const PRO_SEVEN_COLORS = [
  { id: 'navy', name: 'ディープネイビー', bg: '#0F172A', card: '#1E293B', text: '#F8FAFC' },
  { id: 'forest', name: 'フォレストグリーン', bg: '#064E3B', card: '#065F46', text: '#ECFDF5' },
  { id: 'terracotta', name: 'テラコッタ', bg: '#7C2D12', card: '#9A3412', text: '#FFF7ED' },
  { id: 'purple', name: 'ラベンダーパープル', bg: '#4C1D95', card: '#5B21B6', text: '#FAF5FF' },
  { id: 'amber', name: 'サンセットアンバー', bg: '#78350F', card: '#92400E', text: '#FEF3C7' },
  { id: 'sky', name: 'スカイブルー', bg: '#0C4A6E', card: '#075985', text: '#F0F9FF' },
  { id: 'rose', name: 'ローズピンク', bg: '#831843', card: '#9D174D', text: '#FFF1F2' },
];

export default function CreateMy3Page() {
  const router = useRouter();

  // 作成ステップ: 1 = アイテム入力, 2 = プレビュー＆デザイン・カラー編集
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [showProModal, setShowProModal] = useState(false);

  // スマホ表示時のStep 2タブ: 'design' = 色・フォント編集, 'preview' = 全画面プレビュー
  const [step2MobileTab, setStep2MobileTab] = useState<'design' | 'preview'>('design');

  // プラン選択: 'free' | 'pro'
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>('free');

  // 基本情報
  const [title, setTitle] = useState('僕が人生で本気で買ってよかったデスク秘密基地3選');
  const [description, setDescription] = useState('散らかったデスクと肩こりに悩むすべての人へ。毎日の作業が楽しくなる最高の3つの相棒。');
  const [userAffiliateTag, setUserAffiliateTag] = useState('');

  // デザイン・カラー設定
  // 無料用カラー選択 ('white' | 'black' | 'beige')
  const [freeColorId, setFreeColorId] = useState<'white' | 'black' | 'beige'>('white');

  // Pro用カラー（7色パレットまたは自由カラーピッカー）
  const [proColorId, setProColorId] = useState<string>('navy');
  const [customBgColor, setCustomBgColor] = useState('#0F172A');
  const [customCardColor, setCustomCardColor] = useState('#1E293B');

  // フォント設定（Pro限定、5種類）
  const [selectedFontId, setSelectedFontId] = useState<string>('gothic');

  // 厳選3アイテム固定
  const [items, setItems] = useState<My3Item[]>([
    {
      id: 'item-1',
      name: 'HHKB Professional HYBRID Type-S 墨',
      comment: '打鍵音が完全に癒し。一度このスコスコ感に慣れると、もう他のキーボードには戻れません。',
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      amazonUrl: 'https://www.amazon.co.jp/dp/B082TXXCGF',
      asin: 'B082TXXCGF',
    },
    {
      id: 'item-2',
      name: 'Apple AirPods Pro 第2世代 (USB-C)',
      comment: 'ノイキャンをONにした瞬間に世界から雑音が消え去る。カフェが完全な個室作業部屋になります。',
      imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
      amazonUrl: 'https://www.amazon.co.jp/dp/B0CHWRXH8B',
      asin: 'B0CHWRXH8B',
    },
    {
      id: 'item-3',
      name: 'Logicool MX Master 3S 静音マウス',
      comment: '手首が一切疲れず、超高速スクロールで長文ドキュメントも一瞬で移動できる最高のマウス。',
      imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
      amazonUrl: 'https://www.amazon.co.jp/dp/B0B1475Q6B',
      asin: 'B0B1475Q6B',
    },
  ]);

  const [loadingScrapeIndex, setLoadingScrapeIndex] = useState<number | null>(null);
  const [scrapeNotification, setScrapeNotification] = useState<string | null>(null);

  // ファイルアップロード用の隠しinput参照（各アイテム用）
  const fileInputRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
  ];

  // 端末のフォルダから画像ファイルをアップロード
  const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('画像ファイル（PNG, JPG, WebP等）を選択してください。');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setItems((prev) => {
          const next = [...prev];
          next[index] = { ...next[index], imageUrl: dataUrl };
          return next;
        });
        setScrapeNotification(`アイテム #${index + 1} の写真をアップロードしました！`);
        setTimeout(() => setScrapeNotification(null), 3000);
      }
    };
    reader.readAsDataURL(file);
    // 同じファイルを再選択できるようにリセット
    e.target.value = '';
  };

  const handleScrapeAmazon = async (index: number, targetUrl: string) => {
    if (!targetUrl) return;
    setLoadingScrapeIndex(index);
    setScrapeNotification(null);

    try {
      const res = await fetch(`/api/amazon-scrape?url=${encodeURIComponent(targetUrl)}`);
      const data = await res.json();

      if (data.success && data.item) {
        setItems((prev) => {
          const next = [...prev];
          next[index] = {
            ...next[index],
            name: data.item.title || next[index].name,
            imageUrl: data.item.imageUrl || next[index].imageUrl,
            asin: data.item.asin || next[index].asin,
          };
          return next;
        });
        setScrapeNotification(`アイテム #${index + 1} の商品情報と画像を取得しました！`);
        setTimeout(() => setScrapeNotification(null), 3000);
      }
    } catch {
      setScrapeNotification('取得に失敗しました。商品名を入力するか、写真をアップロードしてください。');
      setTimeout(() => setScrapeNotification(null), 3000);
    } finally {
      setLoadingScrapeIndex(null);
    }
  };

  const handleItemChange = (index: number, field: keyof My3Item, value: string) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // 現在適用中のプレビュー用スタイル算出
  const currentFont = FONT_OPTIONS.find((f) => f.id === selectedFontId) || FONT_OPTIONS[0];

  const previewStyles = selectedPlan === 'pro'
    ? {
        bg: customBgColor,
        card: customCardColor,
        text: customBgColor === '#111827' || customBgColor === '#0F172A' || customBgColor === '#064E3B' || customBgColor === '#7C2D12' || customBgColor === '#4C1D95' || customBgColor === '#78350F' || customBgColor === '#0C4A6E' || customBgColor === '#831843' ? '#F8FAFC' : '#1C1C1E',
        cardText: customCardColor === '#1E293B' || customCardColor === '#065F46' || customCardColor === '#9A3412' || customCardColor === '#5B21B6' || customCardColor === '#92400E' || customCardColor === '#075985' || customCardColor === '#9D174D' || customCardColor === '#111827' || customCardColor === '#1F2937' ? '#FFFFFF' : '#1C1C1E',
        cardCommentBg: customCardColor === '#1E293B' || customCardColor === '#065F46' || customCardColor === '#9A3412' || customCardColor === '#5B21B6' || customCardColor === '#92400E' || customCardColor === '#075985' || customCardColor === '#9D174D' || customCardColor === '#111827' ? 'rgba(255,255,255,0.08)' : '#F7F8FC',
        fontFamily: currentFont.family,
      }
    : {
        bg: FREE_COLOR_PRESETS.find((c) => c.id === freeColorId)?.bg || '#F8F9FD',
        card: FREE_COLOR_PRESETS.find((c) => c.id === freeColorId)?.card || '#FFFFFF',
        text: FREE_COLOR_PRESETS.find((c) => c.id === freeColorId)?.text || '#1C1C1E',
        cardText: freeColorId === 'black' ? '#FFFFFF' : '#1C1C1E',
        cardCommentBg: freeColorId === 'black' ? 'rgba(255,255,255,0.08)' : '#F7F8FC',
        fontFamily: FONT_OPTIONS[0].family, // 無料は標準モダンゴシック
      };

  const handlePublish = () => {
    const slug = 'my-selection-' + Date.now().toString().slice(-4);
    alert(`「${title}」のMY 3が作成されました！\nURL: https://my3.app/p/${slug}`);
    router.push(`/p/gadget-desk-nomad`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FD', padding: '24px 0 100px' }}>
      <div className="container" style={{ maxWidth: '1040px' }}>
        
        {/* Step Indicator Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            padding: '6px 12px',
            borderRadius: '40px',
            border: '1px solid #EAECEF',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            marginBottom: '14px',
            gap: '8px',
          }}>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '30px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '0.85rem',
                backgroundColor: currentStep === 1 ? '#4B7BEC' : 'transparent',
                color: currentStep === 1 ? '#FFFFFF' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              <span>1. 3つのアイテムを選ぶ</span>
            </button>

            <Icon name="arrow_forward" size={14} color="#CBD5E1" />

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '30px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '0.85rem',
                backgroundColor: currentStep === 2 ? '#E85A71' : 'transparent',
                color: currentStep === 2 ? '#FFFFFF' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              <span>2. プレビュー & デザイン変更</span>
            </button>
          </div>

          <h1 style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.1rem)', fontWeight: 900, color: '#1C1C1E', margin: '0 0 6px' }}>
            {currentStep === 1 ? '偏愛する3つのアイテムを選ぶ' : '仕上がりプレビュー & 色・フォント編集'}
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
            {currentStep === 1 
              ? 'あなたの愛用品を3つ選んで入力してください。「次へ」を押すとプレビューとデザイン変更へ進みます。'
              : 'プレビューを見ながら、カラーやフォントを自由にカスタマイズしましょう。'}
          </p>
        </div>

        {/* Global Notification Toast */}
        {scrapeNotification && (
          <div style={{
            position: 'fixed',
            top: '76px',
            right: '20px',
            zIndex: 100,
            background: '#FFFFFF',
            border: '2px solid #2ECC71',
            color: '#1C1C1E',
            padding: '12px 18px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
            fontSize: '0.85rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Check size={18} color="#2ECC71" />
            <span>{scrapeNotification}</span>
          </div>
        )}

        {/* =========================================================================
            STEP 1: 3つのアイテムを選ぶ（手軽さMAX・フォルダから写真アップロード）
            ========================================================================= */}
        {currentStep === 1 && (
          <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Title & Description */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '24px',
              border: '1px solid #EAECEF',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1C1C1E', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="edit_note" size={22} color="#4B7BEC" />
                <span>リストのタイトル & 紹介文</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1C1C1E', marginBottom: '6px' }}>
                    MY 3 タイトル <span style={{ color: '#E85A71' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="例: 年間120回通うサウナーの極上ととのいギア3選"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: '#F8F9FD',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.92rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1C1C1E', marginBottom: '6px' }}>
                    一言紹介文（あなたの熱い想い・誰向けか）
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="例: 散らかったデスクと肩こりに悩むすべての人へ。毎日の作業が楽しくなる最高の3つの相棒。"
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: '#F8F9FD',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem',
                      lineHeight: 1.4,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 3 Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {items.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '22px',
                    border: '1px solid #EAECEF',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '8px',
                        backgroundColor: '#1C1C1E',
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-en)',
                        fontSize: '0.85rem',
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {index + 1}
                      </span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1C1C1E' }}>
                        アイテム {index + 1}
                      </span>
                    </div>

                    {/* 隠しファイルインプット */}
                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => { fileInputRefs[index].current = el; }}
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(index, e)}
                    />

                    {/* フォルダから写真アップロードボタン */}
                    <button
                      type="button"
                      onClick={() => fileInputRefs[index].current?.click()}
                      className="btn btn-sm"
                      style={{
                        fontSize: '0.78rem',
                        backgroundColor: '#EEF3FE',
                        color: '#4B7BEC',
                        border: '1px solid #BFDBFE',
                        padding: '6px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontWeight: 800,
                        borderRadius: '20px',
                        cursor: 'pointer',
                      }}
                      id={`upload-photo-btn-${index}`}
                    >
                      <UploadCloud size={14} />
                      <span>フォルダから写真を選択</span>
                    </button>
                  </div>

                  {/* Amazon URL Input */}
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Amazon 商品URL
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="url"
                        value={item.amazonUrl}
                        onChange={(e) => handleItemChange(index, 'amazonUrl', e.target.value)}
                        placeholder="https://www.amazon.co.jp/dp/... または amzn.to/..."
                        style={{
                          flex: 1,
                          padding: '10px 12px',
                          borderRadius: '10px',
                          background: '#F8F9FD',
                          border: '1px solid #CBD5E1',
                          color: '#1C1C1E',
                          fontSize: '0.85rem',
                          boxSizing: 'border-box',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleScrapeAmazon(index, item.amazonUrl)}
                        disabled={loadingScrapeIndex === index || !item.amazonUrl}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
                      >
                        <Search size={14} />
                        <span>{loadingScrapeIndex === index ? '取得中...' : '自動取得'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Image Preview & Details */}
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    {/* 写真プレビュー（クリックでフォルダ選択ダイアログが起動） */}
                    <div
                      onClick={() => fileInputRefs[index].current?.click()}
                      title="クリックしてフォルダから写真を変更"
                      style={{
                        width: '84px',
                        height: '84px',
                        borderRadius: '16px',
                        backgroundColor: '#F1F4F9',
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: '2px dashed #CBD5E1',
                        cursor: 'pointer',
                        position: 'relative',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      }}
                    >
                      {item.imageUrl ? (
                        <>
                          <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: 'rgba(0,0,0,0.65)',
                            color: '#FFFFFF',
                            fontSize: '0.65rem',
                            textAlign: 'center',
                            padding: '2px 0',
                            fontWeight: 700,
                          }}>
                            変更
                          </div>
                        </>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
                          <UploadCloud size={20} />
                          <span style={{ fontSize: '0.65rem', marginTop: '2px', fontWeight: 700 }}>写真選択</span>
                        </div>
                      )}
                    </div>

                    {/* Name & Comment Inputs */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        placeholder="商品・アイテム名"
                        required
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: '#F8F9FD',
                          border: '1px solid #CBD5E1',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          boxSizing: 'border-box',
                        }}
                      />
                      <textarea
                        value={item.comment}
                        onChange={(e) => handleItemChange(index, 'comment', e.target.value)}
                        placeholder="偏愛ポイント（ここが好き！買って生活がどう変わったか）"
                        required
                        rows={2}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: '#F8F9FD',
                          border: '1px solid #CBD5E1',
                          fontSize: '0.82rem',
                          lineHeight: 1.4,
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Next Button to Step 2 */}
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setCurrentStep(2);
                }}
                className="btn btn-coral btn-lg"
                style={{
                  width: '100%',
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  padding: '18px 32px',
                  borderRadius: '40px',
                  boxShadow: '0 12px 28px rgba(232, 90, 113, 0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}
                id="btn-go-to-step2"
              >
                <span>次へ（仕上がりのプレビューとデザイン変更へ）</span>
                <ArrowRight size={20} />
              </button>
            </div>

          </div>
        )}

        {/* =========================================================================
            STEP 2: プレビューを見ながら色・フォントなどを変更する
            ========================================================================= */}
        {currentStep === 2 && (
          <div>
            {/* Top Bar: Back Button & Mobile Tab Switcher */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
              <div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                  id="btn-back-to-step1"
                >
                  <ArrowLeft size={16} />
                  <span>アイテム入力を修正する</span>
                </button>
              </div>

              {/* スマホ専用タブ切り替え: 色・フォント編集 ⇔ 全体プレビュー */}
              <div className="step2-mobile-tab-bar" style={{
                backgroundColor: '#FFFFFF',
                padding: '6px',
                borderRadius: '40px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                border: '1px solid #EAECEF',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setStep2MobileTab('design')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px 14px',
                      borderRadius: '30px',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      backgroundColor: step2MobileTab === 'design' ? '#4B7BEC' : 'transparent',
                      color: step2MobileTab === 'design' ? '#FFFFFF' : '#48484A',
                      transition: 'all 0.2s',
                    }}
                    id="step2-mobile-tab-design"
                  >
                    <Icon name="palette" size={16} />
                    <span>色・フォント変更</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep2MobileTab('preview')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px 14px',
                      borderRadius: '30px',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      backgroundColor: step2MobileTab === 'preview' ? '#E85A71' : 'transparent',
                      color: step2MobileTab === 'preview' ? '#FFFFFF' : '#48484A',
                      transition: 'all 0.2s',
                    }}
                    id="step2-mobile-tab-preview"
                  >
                    <Icon name="visibility" size={16} />
                    <span>仕上がりプレビュー</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2-Column Layout: Left = Live Phone Simulator, Right = Design Controls */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 0.95fr) minmax(0, 1.05fr)',
              gap: '32px',
              alignItems: 'flex-start',
            }} className="step2-split-layout">
              
              {/* LEFT: Phone Simulator (スマホでは step2MobileTab === 'preview' の時のみ表示) */}
              <div className={`step2-phone-column ${step2MobileTab === 'design' ? 'hide-on-mobile-design' : ''}`} style={{
                position: 'sticky',
                top: '84px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  padding: '0 8px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Eye size={16} color="#E85A71" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1C1C1E' }}>
                      リアルタイム仕上がりプレビュー
                    </span>
                  </div>
                  <span className="badge badge-tag" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                    {selectedPlan === 'pro' ? 'Proカスタム適用中' : '無料プラン'}
                  </span>
                </div>

                {/* Simulated Phone Shell */}
                <div style={{
                  width: '100%',
                  maxWidth: '380px',
                  margin: '0 auto',
                  borderRadius: '36px',
                  border: '10px solid #1C1C1E',
                  backgroundColor: previewStyles.bg,
                  boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
                  overflow: 'hidden',
                  minHeight: '620px',
                  maxHeight: '760px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  fontFamily: previewStyles.fontFamily,
                }}>
                  {/* Phone Speaker Notch */}
                  <div style={{
                    height: '24px',
                    backgroundColor: '#1C1C1E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <div style={{ width: '60px', height: '4px', borderRadius: '2px', backgroundColor: '#333' }} />
                  </div>

                  {/* Phone Inner Content (Scrollable) */}
                  <div style={{
                    padding: '20px 14px 60px',
                    overflowY: 'auto',
                    flex: 1,
                  }}>
                    {/* 3-Item Header Collage */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '4px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      marginBottom: '16px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}>
                      {items.map((it, idx) => (
                        <div key={idx} style={{ height: '72px', position: 'relative' }}>
                          <img src={it.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{
                            position: 'absolute',
                            bottom: '3px',
                            left: '4px',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: '#fff',
                            fontSize: '0.62rem',
                            fontWeight: 900,
                            padding: '1px 5px',
                            borderRadius: '3px',
                          }}>
                            {idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Profile Capsule */}
                    <div style={{
                      textAlign: 'center',
                      marginBottom: '16px',
                      padding: '16px 14px',
                      borderRadius: '18px',
                      backgroundColor: previewStyles.card,
                      color: previewStyles.cardText,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                      transition: 'all 0.2s',
                    }}>
                      <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        margin: '0 auto 8px',
                        overflow: 'hidden',
                        border: '2px solid #4B7BEC',
                      }}>
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                          alt="avatar"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <h4 style={{
                        fontSize: '0.96rem',
                        fontWeight: 900,
                        margin: 0,
                        lineHeight: 1.35,
                      }}>
                        {title || '無題のMY 3'}
                      </h4>
                      <p style={{
                        fontSize: '0.74rem',
                        opacity: 0.85,
                        marginTop: '4px',
                        lineHeight: 1.45,
                      }}>
                        {description}
                      </p>
                    </div>

                    {/* 3 Item Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {items.map((item, idx) => (
                        <div
                          key={item.id}
                          style={{
                            backgroundColor: previewStyles.card,
                            color: previewStyles.cardText,
                            borderRadius: '18px',
                            padding: '14px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                            border: '1px solid rgba(0,0,0,0.06)',
                            transition: 'all 0.2s',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                            <span style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '4px',
                              backgroundColor: '#1C1C1E',
                              color: '#FFFFFF',
                              fontSize: '0.7rem',
                              fontWeight: 900,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              {idx + 1}
                            </span>
                            <span style={{ fontSize: '0.82rem', fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.name}
                            </span>
                          </div>

                          <div style={{
                            width: '100%',
                            height: '115px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            marginBottom: '8px',
                          }}>
                            <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>

                          <div style={{
                            padding: '8px 10px',
                            borderRadius: '10px',
                            backgroundColor: previewStyles.cardCommentBg,
                            fontSize: '0.75rem',
                            lineHeight: 1.45,
                            marginBottom: '8px',
                          }}>
                            「{item.comment}」
                          </div>

                          <div style={{
                            backgroundColor: '#FF9900',
                            color: '#111',
                            borderRadius: '30px',
                            textAlign: 'center',
                            padding: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                          }}>
                            Amazonで見る
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* スマホ表示時のプレビュー下部ナビゲーション */}
                <div className="step2-mobile-tab-bar" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setStep2MobileTab('design')}
                    className="btn btn-secondary"
                    style={{ width: '100%', fontSize: '0.92rem', padding: '12px' }}
                  >
                    <Icon name="palette" size={16} />
                    <span>色やフォントを変更する</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePublish}
                    className="btn btn-coral"
                    style={{ width: '100%', fontSize: '0.98rem', fontWeight: 900, padding: '14px', borderRadius: '40px' }}
                  >
                    <Icon name="auto_awesome" size={18} />
                    <span>この内容でMY 3を公開する</span>
                  </button>
                </div>
              </div>

              {/* RIGHT: Design Controls (スマホでは step2MobileTab === 'design' の時のみ表示) */}
              <div className={`step2-controls-column ${step2MobileTab === 'preview' ? 'hide-on-mobile-preview' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* スマホ用: 色・フォントがリアルタイムで反映されるミニ見本カード */}
                <div className="step2-mobile-preview-card" style={{
                  backgroundColor: previewStyles.bg,
                  borderRadius: '20px',
                  padding: '16px',
                  border: '2px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  fontFamily: previewStyles.fontFamily,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: previewStyles.text, opacity: 0.8, display: 'block', marginBottom: '4px' }}>
                      リアルタイム色見本（{selectedPlan === 'pro' ? 'Pro' : '無料'}）
                    </span>
                    <div style={{
                      backgroundColor: previewStyles.card,
                      color: previewStyles.cardText,
                      padding: '10px 14px',
                      borderRadius: '12px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                    }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {title || '無題のMY 3'}
                      </div>
                      <div style={{ fontSize: '0.7rem', opacity: 0.75, marginTop: '2px' }}>
                        フォント: {currentFont.name}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStep2MobileTab('preview');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      backgroundColor: '#E85A71',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '24px',
                      padding: '10px 14px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(232, 90, 113, 0.3)',
                    }}
                  >
                    <Eye size={14} />
                    <span>全体プレビュー</span>
                  </button>
                </div>
                
                {/* Plan Toggle (Free vs Pro) */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '22px',
                  border: '1px solid #EAECEF',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1C1C1E' }}>
                      適用プランの選択
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowProModal(true)}
                      style={{ fontSize: '0.75rem', color: '#E85A71', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                    >
                      Proプランとは？
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div
                      onClick={() => setSelectedPlan('free')}
                      style={{
                        padding: '14px',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        border: selectedPlan === 'free' ? '2px solid #4B7BEC' : '1px solid #E2E8F0',
                        backgroundColor: selectedPlan === 'free' ? '#EEF3FE' : '#F8F9FD',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        transition: 'all 0.2s',
                      }}
                      id="select-plan-free"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 900, fontSize: '0.95rem', color: selectedPlan === 'free' ? '#4B7BEC' : '#1C1C1E' }}>
                          無料プラン
                        </span>
                        {selectedPlan === 'free' && <Check size={16} color="#4B7BEC" strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        白・黒・ベージュの3色
                      </span>
                    </div>

                    <div
                      onClick={() => setSelectedPlan('pro')}
                      style={{
                        padding: '14px',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        border: selectedPlan === 'pro' ? '2px solid #E85A71' : '1px solid #E2E8F0',
                        backgroundColor: selectedPlan === 'pro' ? '#FEF2F2' : '#F8F9FD',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        transition: 'all 0.2s',
                      }}
                      id="select-plan-pro"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Crown size={14} color="#E85A71" />
                          <span style={{ fontWeight: 900, fontSize: '0.95rem', color: selectedPlan === 'pro' ? '#E85A71' : '#1C1C1E' }}>
                            Proプラン
                          </span>
                        </div>
                        {selectedPlan === 'pro' && <Check size={16} color="#E85A71" strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        7色＋自由カラーピッカー＋5フォント
                      </span>
                    </div>
                  </div>
                </div>

                {/* 1. Color Customization Section */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '24px',
                  border: '1px solid #EAECEF',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Palette size={18} color="#4B7BEC" />
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#1C1C1E', margin: 0 }}>
                      カラーの設定
                    </h3>
                  </div>

                  {/* FREE PLAN: 白・黒・ベージュの3色から選択 */}
                  {selectedPlan === 'free' && (
                    <div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        無料プランでは、洗練された「白」「黒」「ベージュ」の3つの基本カラーをお選びいただけます。
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        {FREE_COLOR_PRESETS.map((preset) => {
                          const isSelected = freeColorId === preset.id;
                          return (
                            <div
                              key={preset.id}
                              onClick={() => setFreeColorId(preset.id as any)}
                              style={{
                                padding: '12px',
                                borderRadius: '16px',
                                cursor: 'pointer',
                                border: isSelected ? '2px solid #4B7BEC' : '1px solid #E2E8F0',
                                backgroundColor: isSelected ? '#EEF3FE' : '#F8F9FD',
                                textAlign: 'center',
                                transition: 'all 0.2s',
                              }}
                              id={`free-color-${preset.id}`}
                            >
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: preset.bg,
                                border: `2px solid ${preset.border}`,
                                margin: '0 auto 8px',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                              }} />
                              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: isSelected ? '#4B7BEC' : '#1C1C1E', display: 'block' }}>
                                {preset.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* PRO PLAN: 七色（7色）プリセット ＋ 自由カラーピッカー */}
                  {selectedPlan === 'pro' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {/* 7-Color Presets */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1C1C1E' }}>
                            厳選 7色のプリセット
                          </span>
                          <span className="badge badge-pro" style={{ fontSize: '0.65rem' }}>
                            <Crown size={12} /> Pro
                          </span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: '8px' }}>
                          {PRO_SEVEN_COLORS.map((col) => {
                            const isSelected = proColorId === col.id;
                            return (
                              <div
                                key={col.id}
                                onClick={() => {
                                  setProColorId(col.id);
                                  setCustomBgColor(col.bg);
                                  setCustomCardColor(col.card);
                                }}
                                style={{
                                  padding: '8px 4px',
                                  borderRadius: '12px',
                                  cursor: 'pointer',
                                  border: isSelected ? '2px solid #E85A71' : '1px solid #E2E8F0',
                                  backgroundColor: isSelected ? '#FEF2F2' : '#FFFFFF',
                                  textAlign: 'center',
                                  transition: 'all 0.15s',
                                }}
                                id={`pro-color-${col.id}`}
                              >
                                <div style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  backgroundColor: col.bg,
                                  margin: '0 auto 4px',
                                  border: '2px solid #FFFFFF',
                                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                }} />
                                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: isSelected ? '#E85A71' : '#48484A', display: 'block' }}>
                                  {col.name}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Native Color Pickers for Complete Freedom */}
                      <div style={{
                        padding: '16px',
                        borderRadius: '16px',
                        backgroundColor: '#F8F9FD',
                        border: '1px solid #E2E8F0',
                      }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1C1C1E', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                          <Icon name="format_paint" size={18} color="#E85A71" />
                          <span>自由カラーピッカー（好きな色に自由調色）</span>
                        </span>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                          {/* 1. 背景色 */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                              1. ページの背景色
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <input
                                type="color"
                                value={customBgColor}
                                onChange={(e) => {
                                  setCustomBgColor(e.target.value);
                                  setProColorId('custom');
                                }}
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '10px',
                                  border: '2px solid #FFFFFF',
                                  cursor: 'pointer',
                                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                }}
                                id="picker-bg-color"
                              />
                              <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#666' }}>{customBgColor}</span>
                            </div>
                          </div>

                          {/* 2. カラム/ボックス色 */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                              2. カラム/ボックス色
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <input
                                type="color"
                                value={customCardColor}
                                onChange={(e) => {
                                  setCustomCardColor(e.target.value);
                                  setProColorId('custom');
                                }}
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '10px',
                                  border: '2px solid #FFFFFF',
                                  cursor: 'pointer',
                                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                }}
                                id="picker-card-color"
                              />
                              <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#666' }}>{customCardColor}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Font Customization Section (5 Fonts) */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '24px',
                  border: '1px solid #EAECEF',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Type size={18} color="#4B7BEC" />
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#1C1C1E', margin: 0 }}>
                        フォントの選択（5種類）
                      </h3>
                    </div>
                    {selectedPlan === 'free' ? (
                      <span className="badge" style={{ backgroundColor: '#F1F5F9', color: '#64748B', fontSize: '0.68rem' }}>
                        <Lock size={12} /> PRO限定
                      </span>
                    ) : (
                      <span className="badge badge-pro" style={{ fontSize: '0.68rem' }}>
                        <Crown size={12} /> Pro解放中
                      </span>
                    )}
                  </div>

                  {selectedPlan === 'free' ? (
                    <div style={{
                      padding: '16px',
                      borderRadius: '16px',
                      backgroundColor: '#F8F9FD',
                      border: '1px dashed #CBD5E1',
                      textAlign: 'center',
                    }}>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.5 }}>
                        無料プランは「モダン・ゴシック（標準）」が適用されます。<br />
                        <strong>Proプラン</strong>にアップグレードすると、明朝体・丸ゴシック・手書き風など5種類のフォントへ自由に変更できます。
                      </p>
                      <button
                        type="button"
                        onClick={() => setSelectedPlan('pro')}
                        className="btn btn-sm"
                        style={{ backgroundColor: '#E85A71', color: '#FFFFFF', fontWeight: 800, fontSize: '0.78rem' }}
                      >
                        <Crown size={14} />
                        <span>Proプランでフォントを試す</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {FONT_OPTIONS.map((font) => {
                        const isSelected = selectedFontId === font.id;
                        return (
                          <div
                            key={font.id}
                            onClick={() => setSelectedFontId(font.id)}
                            style={{
                              padding: '12px 14px',
                              borderRadius: '14px',
                              cursor: 'pointer',
                              border: isSelected ? '2px solid #E85A71' : '1px solid #E2E8F0',
                              backgroundColor: isSelected ? '#FEF2F2' : '#F8F9FD',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              transition: 'all 0.15s',
                            }}
                            id={`font-opt-${font.id}`}
                          >
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontFamily: font.family, fontSize: '0.92rem', fontWeight: 800, color: isSelected ? '#E85A71' : '#1C1C1E' }}>
                                  {font.name}
                                </span>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                  ({font.sub})
                                </span>
                              </div>
                              <span style={{ fontFamily: font.family, fontSize: '0.78rem', color: '#64748B', display: 'block', marginTop: '2px' }}>
                                {font.sample}
                              </span>
                            </div>

                            {isSelected && <Check size={18} color="#E85A71" strokeWidth={3} />}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Optional Affiliate Tag */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '20px 24px',
                  border: '1px solid #EAECEF',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    あなたのアソシエイトID（任意）
                  </label>
                  <input
                    type="text"
                    value={userAffiliateTag}
                    onChange={(e) => setUserAffiliateTag(e.target.value)}
                    placeholder="例: yourname-22 (空欄の場合は公式IDが適用されます)"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: '#F8F9FD',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.82rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Final Publish Button */}
                <button
                  type="button"
                  onClick={handlePublish}
                  className="btn btn-coral btn-lg"
                  style={{
                    width: '100%',
                    fontSize: '1.1rem',
                    fontWeight: 900,
                    padding: '18px 24px',
                    borderRadius: '40px',
                    boxShadow: '0 12px 28px rgba(232, 90, 113, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                  }}
                  id="final-publish-btn"
                >
                  <Icon name="auto_awesome" size={20} />
                  <span>この内容でMY 3を公開する</span>
                </button>

              </div>
            </div>
          </div>
        )}

      </div>

      {/* Pro Modal */}
      {showProModal && <ProModal onClose={() => setShowProModal(false)} />}

      <style jsx>{`
        @media (max-width: 860px) {
          .step2-split-layout {
            grid-template-columns: 1fr !important;
          }
          .step2-phone-column {
            position: static !important;
            top: 0 !important;
          }
          .hide-on-mobile-design {
            display: none !important;
          }
          .hide-on-mobile-preview {
            display: none !important;
          }
          .step2-mobile-tab-bar {
            display: block !important;
          }
          .step2-mobile-preview-card {
            display: flex !important;
          }
        }
        @media (min-width: 861px) {
          .step2-mobile-tab-bar {
            display: none !important;
          }
          .step2-mobile-preview-card {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
