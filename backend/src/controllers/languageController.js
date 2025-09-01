// Language configurations
const SUPPORTED_LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    speechRecognitionCode: 'en-US',
    voiceCommands: {
      add: ['add', 'i need', 'buy', 'get', 'pick up', 'put', 'include'],
      search: ['find', 'search for', 'look for', 'show me'],
      remove: ['remove', 'delete', 'take off', 'cross off', 'mark off'],
      complete: ['mark', 'check', 'got', 'bought', 'found'],
      clear: ['clear', 'delete', 'remove', 'start over', 'start fresh'],
      filter: ['filter', 'show', 'find', 'under', 'below']
    }
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    speechRecognitionCode: 'es-ES',
    voiceCommands: {
      add: ['añadir', 'necesito', 'comprar', 'obtener', 'agregar', 'poner', 'incluir'],
      search: ['encontrar', 'buscar', 'busca', 'muéstrame', 'enseña'],
      remove: ['quitar', 'eliminar', 'borrar', 'tachar', 'marcar'],
      complete: ['marcar', 'verificar', 'conseguí', 'compré', 'encontré'],
      clear: ['limpiar', 'borrar', 'eliminar', 'empezar de nuevo', 'comenzar fresco'],
      filter: ['filtrar', 'mostrar', 'encontrar', 'menos de', 'por debajo de']
    }
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    speechRecognitionCode: 'fr-FR',
    voiceCommands: {
      add: ['ajouter', 'j\'ai besoin', 'acheter', 'obtenir', 'prendre', 'mettre', 'inclure'],
      search: ['trouver', 'chercher', 'rechercher', 'montrez-moi', 'montre'],
      remove: ['supprimer', 'enlever', 'effacer', 'rayer', 'marquer'],
      complete: ['marquer', 'vérifier', 'j\'ai', 'j\'ai acheté', 'j\'ai trouvé'],
      clear: ['effacer', 'supprimer', 'enlever', 'recommencer', 'commencer à nouveau'],
      filter: ['filtrer', 'montrer', 'trouver', 'moins de', 'en dessous de']
    }
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    speechRecognitionCode: 'de-DE',
    voiceCommands: {
      add: ['hinzufügen', 'ich brauche', 'kaufen', 'bekommen', 'holen', 'setzen', 'einschließen'],
      search: ['finden', 'suchen', 'nach', 'zeig mir', 'zeige'],
      remove: ['entfernen', 'löschen', 'wegnehmen', 'durchstreichen', 'markieren'],
      complete: ['markieren', 'prüfen', 'ich habe', 'ich habe gekauft', 'ich habe gefunden'],
      clear: ['löschen', 'entfernen', 'wegnehmen', 'von vorne anfangen', 'neu beginnen'],
      filter: ['filtern', 'zeigen', 'finden', 'unter', 'weniger als']
    }
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    speechRecognitionCode: 'it-IT',
    voiceCommands: {
      add: ['aggiungere', 'ho bisogno', 'comprare', 'ottenere', 'prendere', 'mettere', 'includere'],
      search: ['trovare', 'cercare', 'cerca', 'mostrami', 'mostra'],
      remove: ['rimuovere', 'eliminare', 'cancellare', 'barrato', 'segnare'],
      complete: ['segnare', 'verificare', 'ho', 'ho comprato', 'ho trovato'],
      clear: ['cancellare', 'eliminare', 'rimuovere', 'ricominciare', 'iniziare di nuovo'],
      filter: ['filtrare', 'mostrare', 'trovare', 'sotto', 'meno di']
    }
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    speechRecognitionCode: 'pt-BR',
    voiceCommands: {
      add: ['adicionar', 'preciso', 'comprar', 'obter', 'pegar', 'colocar', 'incluir'],
      search: ['encontrar', 'procurar', 'buscar', 'me mostre', 'mostre'],
      remove: ['remover', 'excluir', 'apagar', 'riscar', 'marcar'],
      complete: ['marcar', 'verificar', 'consegui', 'comprei', 'encontrei'],
      clear: ['limpar', 'excluir', 'remover', 'começar de novo', 'começar fresco'],
      filter: ['filtrar', 'mostrar', 'encontrar', 'abaixo de', 'menos de']
    }
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    speechRecognitionCode: 'ja-JP',
    voiceCommands: {
      add: ['追加', '必要', '買う', '取得', '取る', '置く', '含める'],
      search: ['見つける', '探す', '検索', '見せて', '表示'],
      remove: ['削除', '除去', '消す', '線を引く', 'マーク'],
      complete: ['マーク', '確認', '手に入れた', '買った', '見つけた'],
      clear: ['クリア', '削除', '除去', 'やり直し', '新しく始める'],
      filter: ['フィルター', '表示', '見つける', '以下', '未満']
    }
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    speechRecognitionCode: 'ko-KR',
    voiceCommands: {
      add: ['추가', '필요', '구매', '얻다', '가져가다', '놓다', '포함'],
      search: ['찾다', '검색', '찾기', '보여줘', '표시'],
      remove: ['제거', '삭제', '지우다', '선 긋기', '표시'],
      complete: ['표시', '확인', '얻었다', '구매했다', '찾았다'],
      clear: ['지우기', '삭제', '제거', '다시 시작', '새로 시작'],
      filter: ['필터', '표시', '찾다', '이하', '미만']
    }
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    speechRecognitionCode: 'zh-CN',
    voiceCommands: {
      add: ['添加', '需要', '购买', '获得', '拿', '放', '包括'],
      search: ['找到', '搜索', '查找', '给我看', '显示'],
      remove: ['删除', '移除', '清除', '划线', '标记'],
      complete: ['标记', '确认', '得到了', '购买了', '找到了'],
      clear: ['清除', '删除', '移除', '重新开始', '重新开始'],
      filter: ['过滤', '显示', '找到', '以下', '少于']
    }
  }
];

// Translations for UI
const TRANSLATIONS = {
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
  }
  // Add more languages as needed
};

// Get all supported languages
export const getSupportedLanguages = async () => {
  return SUPPORTED_LANGUAGES;
};

// Get specific language configuration
export const getLanguageConfig = async (code) => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
};

// Get translations for a specific language
export const getTranslations = async (code) => {
  return TRANSLATIONS[code] || TRANSLATIONS.en; // Fallback to English
};

// Get default language
export const getDefaultLanguage = async () => {
  return SUPPORTED_LANGUAGES[0]; // English as default
};
