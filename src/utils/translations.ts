import { LanguageConfig } from '@/types/languages';

export interface UIText {
  // Voice commands help
  voiceCommands: string;
  addingItems: string;
  searchingFiltering: string;
  managingList: string;
  tapToExpand: string;
  
  // Voice button states
  notSupported: string;
  listening: string;
  startVoice: string;
  
  // Voice visualizer
  listeningStatus: string;
  youSaid: string;
  clickMicrophone: string;
  
  // Common actions
  add: string;
  remove: string;
  search: string;
  clear: string;
  done: string;
  
  // Messages
  commandNotRecognized: string;
  commandFailed: string;
  voiceRecognitionError: string;
  
  // Examples
  examples: {
    add: string[];
    search: string[];
    manage: string[];
  };
}

const TRANSLATIONS: Record<string, UIText> = {
  en: {
    voiceCommands: 'Voice Commands',
    addingItems: 'Adding Items',
    searchingFiltering: 'Searching & Filtering',
    managingList: 'Managing List',
    tapToExpand: 'Tap to expand',
    notSupported: 'Not Supported',
    listening: 'Listening...',
    startVoice: 'Start Voice',
    listeningStatus: 'Listening...',
    youSaid: 'You said:',
    clickMicrophone: 'Click the microphone to start voice commands',
    add: 'Add',
    remove: 'Remove',
    search: 'Search',
    clear: 'Clear',
    done: 'Done',
    commandNotRecognized: 'Command not recognized',
    commandFailed: 'Command failed',
    voiceRecognitionError: 'Voice recognition error',
    examples: {
      add: ['Add milk', 'I need 2 apples', 'Buy organic bread'],
      search: ['Find organic apples', 'Show toothpaste under $5', 'Search for Dairy Best milk'],
      manage: ['Remove milk', 'Mark bread as done', 'Clear list']
    }
  },
  es: {
    voiceCommands: 'Comandos de Voz',
    addingItems: 'Agregar Artículos',
    searchingFiltering: 'Búsqueda y Filtrado',
    managingList: 'Gestionar Lista',
    tapToExpand: 'Toca para expandir',
    notSupported: 'No Soportado',
    listening: 'Escuchando...',
    startVoice: 'Iniciar Voz',
    listeningStatus: 'Escuchando...',
    youSaid: 'Dijiste:',
    clickMicrophone: 'Haz clic en el micrófono para iniciar comandos de voz',
    add: 'Agregar',
    remove: 'Quitar',
    search: 'Buscar',
    clear: 'Limpiar',
    done: 'Hecho',
    commandNotRecognized: 'Comando no reconocido',
    commandFailed: 'Comando falló',
    voiceRecognitionError: 'Error de reconocimiento de voz',
    examples: {
      add: ['Añadir leche', 'Necesito 2 manzanas', 'Comprar pan orgánico'],
      search: ['Encontrar manzanas orgánicas', 'Mostrar pasta dental bajo $5', 'Buscar leche Dairy Best'],
      manage: ['Quitar leche', 'Marcar pan como hecho', 'Limpiar lista']
    }
  },
  fr: {
    voiceCommands: 'Commandes Vocales',
    addingItems: 'Ajouter des Articles',
    searchingFiltering: 'Recherche et Filtrage',
    managingList: 'Gérer la Liste',
    tapToExpand: 'Appuyez pour développer',
    notSupported: 'Non Supporté',
    listening: 'Écoute...',
    startVoice: 'Démarrer la Voix',
    listeningStatus: 'Écoute...',
    youSaid: 'Vous avez dit :',
    clickMicrophone: 'Cliquez sur le microphone pour démarrer les commandes vocales',
    add: 'Ajouter',
    remove: 'Supprimer',
    search: 'Rechercher',
    clear: 'Effacer',
    done: 'Terminé',
    commandNotRecognized: 'Commande non reconnue',
    commandFailed: 'Commande échouée',
    voiceRecognitionError: 'Erreur de reconnaissance vocale',
    examples: {
      add: ['Ajouter du lait', 'J\'ai besoin de 2 pommes', 'Acheter du pain bio'],
      search: ['Trouver des pommes bio', 'Montrer du dentifrice sous 5€', 'Rechercher du lait Dairy Best'],
      manage: ['Supprimer le lait', 'Marquer le pain comme fait', 'Effacer la liste']
    }
  },
  de: {
    voiceCommands: 'Sprachbefehle',
    addingItems: 'Artikel Hinzufügen',
    searchingFiltering: 'Suchen & Filtern',
    managingList: 'Liste Verwalten',
    tapToExpand: 'Tippen zum Erweitern',
    notSupported: 'Nicht Unterstützt',
    listening: 'Höre zu...',
    startVoice: 'Sprache Starten',
    listeningStatus: 'Höre zu...',
    youSaid: 'Sie sagten:',
    clickMicrophone: 'Klicken Sie auf das Mikrofon, um Sprachbefehle zu starten',
    add: 'Hinzufügen',
    remove: 'Entfernen',
    search: 'Suchen',
    clear: 'Löschen',
    done: 'Fertig',
    commandNotRecognized: 'Befehl nicht erkannt',
    commandFailed: 'Befehl fehlgeschlagen',
    voiceRecognitionError: 'Spracherkennungsfehler',
    examples: {
      add: ['Milch hinzufügen', 'Ich brauche 2 Äpfel', 'Bio-Brot kaufen'],
      search: ['Bio-Äpfel finden', 'Zahnpasta unter 5€ zeigen', 'Dairy Best Milch suchen'],
      manage: ['Milch entfernen', 'Brot als erledigt markieren', 'Liste löschen']
    }
  },
  it: {
    voiceCommands: 'Comandi Vocali',
    addingItems: 'Aggiungere Articoli',
    searchingFiltering: 'Ricerca e Filtri',
    managingList: 'Gestire Lista',
    tapToExpand: 'Tocca per espandere',
    notSupported: 'Non Supportato',
    listening: 'Ascoltando...',
    startVoice: 'Avvia Voce',
    listeningStatus: 'Ascoltando...',
    youSaid: 'Hai detto:',
    clickMicrophone: 'Clicca sul microfono per avviare i comandi vocali',
    add: 'Aggiungi',
    remove: 'Rimuovi',
    search: 'Cerca',
    clear: 'Cancella',
    done: 'Fatto',
    commandNotRecognized: 'Comando non riconosciuto',
    commandFailed: 'Comando fallito',
    voiceRecognitionError: 'Errore di riconoscimento vocale',
    examples: {
      add: ['Aggiungi latte', 'Ho bisogno di 2 mele', 'Compra pane biologico'],
      search: ['Trova mele biologiche', 'Mostra dentifricio sotto 5€', 'Cerca latte Dairy Best'],
      manage: ['Rimuovi latte', 'Segna pane come fatto', 'Cancella lista']
    }
  },
  pt: {
    voiceCommands: 'Comandos de Voz',
    addingItems: 'Adicionar Itens',
    searchingFiltering: 'Pesquisa e Filtros',
    managingList: 'Gerenciar Lista',
    tapToExpand: 'Toque para expandir',
    notSupported: 'Não Suportado',
    listening: 'Ouvindo...',
    startVoice: 'Iniciar Voz',
    listeningStatus: 'Ouvindo...',
    youSaid: 'Você disse:',
    clickMicrophone: 'Clique no microfone para iniciar comandos de voz',
    add: 'Adicionar',
    remove: 'Remover',
    search: 'Pesquisar',
    clear: 'Limpar',
    done: 'Feito',
    commandNotRecognized: 'Comando não reconhecido',
    commandFailed: 'Comando falhou',
    voiceRecognitionError: 'Erro de reconhecimento de voz',
    examples: {
      add: ['Adicionar leite', 'Preciso de 2 maçãs', 'Comprar pão orgânico'],
      search: ['Encontrar maçãs orgânicas', 'Mostrar pasta de dente abaixo de R$5', 'Pesquisar leite Dairy Best'],
      manage: ['Remover leite', 'Marcar pão como feito', 'Limpar lista']
    }
  },
  ja: {
    voiceCommands: '音声コマンド',
    addingItems: 'アイテム追加',
    searchingFiltering: '検索とフィルター',
    managingList: 'リスト管理',
    tapToExpand: 'タップして展開',
    notSupported: 'サポートされていません',
    listening: '聞いています...',
    startVoice: '音声開始',
    listeningStatus: '聞いています...',
    youSaid: 'あなたが言ったこと:',
    clickMicrophone: 'マイクをクリックして音声コマンドを開始',
    add: '追加',
    remove: '削除',
    search: '検索',
    clear: 'クリア',
    done: '完了',
    commandNotRecognized: 'コマンドが認識されません',
    commandFailed: 'コマンドが失敗しました',
    voiceRecognitionError: '音声認識エラー',
    examples: {
      add: ['牛乳を追加', 'リンゴ2個が必要', 'オーガニックパンを購入'],
      search: ['オーガニックリンゴを探す', '5ドル以下の歯磨き粉を表示', 'Dairy Best牛乳を検索'],
      manage: ['牛乳を削除', 'パンを完了としてマーク', 'リストをクリア']
    }
  },
  ko: {
    voiceCommands: '음성 명령',
    addingItems: '항목 추가',
    searchingFiltering: '검색 및 필터링',
    managingList: '목록 관리',
    tapToExpand: '탭하여 확장',
    notSupported: '지원되지 않음',
    listening: '듣는 중...',
    startVoice: '음성 시작',
    listeningStatus: '듣는 중...',
    youSaid: '당신이 말한 것:',
    clickMicrophone: '마이크를 클릭하여 음성 명령 시작',
    add: '추가',
    remove: '제거',
    search: '검색',
    clear: '지우기',
    done: '완료',
    commandNotRecognized: '명령이 인식되지 않음',
    commandFailed: '명령 실패',
    voiceRecognitionError: '음성 인식 오류',
    examples: {
      add: ['우유 추가', '사과 2개 필요', '유기농 빵 구매'],
      search: ['유기농 사과 찾기', '5달러 이하 치약 표시', 'Dairy Best 우유 검색'],
      manage: ['우유 제거', '빵을 완료로 표시', '목록 지우기']
    }
  },
  zh: {
    voiceCommands: '语音命令',
    addingItems: '添加物品',
    searchingFiltering: '搜索和筛选',
    managingList: '管理列表',
    tapToExpand: '点击展开',
    notSupported: '不支持',
    listening: '正在听...',
    startVoice: '开始语音',
    listeningStatus: '正在听...',
    youSaid: '您说:',
    clickMicrophone: '点击麦克风开始语音命令',
    add: '添加',
    remove: '删除',
    search: '搜索',
    clear: '清除',
    done: '完成',
    commandNotRecognized: '命令未识别',
    commandFailed: '命令失败',
    voiceRecognitionError: '语音识别错误',
    examples: {
      add: ['添加牛奶', '我需要2个苹果', '购买有机面包'],
      search: ['找到有机苹果', '显示5美元以下的牙膏', '搜索Dairy Best牛奶'],
      manage: ['删除牛奶', '将面包标记为完成', '清除列表']
    }
  }
};

export const getTranslation = (languageCode: string): UIText => {
  return TRANSLATIONS[languageCode] || TRANSLATIONS['en'];
};

export const getTranslationForLanguage = (language: LanguageConfig): UIText => {
  return getTranslation(language.code);
};
