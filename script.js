// --- DOM ELEMENTS ---
const plateNumberInput = document.getElementById('plateNumber'), vehicleTypeSelect = document.getElementById('vehicleType'), arrivalHourInput = document.getElementById('arrivalHour'), arrivalMinuteInput = document.getElementById('arrivalMinute'), noteInput = document.getElementById('note'), keyHandedInput = document.getElementById('keyHanded'), addVehicleBtn = document.getElementById('addVehicleBtn');
const pastPlateInput = document.getElementById('pastPlate'), pastVehicleTypeSelect = document.getElementById('pastVehicleType'), pastArrivalHourInput = document.getElementById('pastArrivalHour'), pastArrivalMinuteInput = document.getElementById('pastArrivalMinute'), pastDepartureHourInput = document.getElementById('pastDepartureHour'), pastDepartureMinuteInput = document.getElementById('pastDepartureMinute'), pastFeeInput = document.getElementById('pastFee'), pastCreditCardInput = document.getElementById('pastCreditCard'), addPastRecordBtn = document.getElementById('addPastRecordBtn');
const carRecordsTableBody = document.getElementById('carRecordsTableBody'), messageBox = document.getElementById('messageBox'), messageText = document.getElementById('messageText'), resetListBtn = document.getElementById('resetListBtn'), exportCsvBtn = document.getElementById('exportCsvBtn'), importCsvBtn = document.getElementById('importCsvBtn'), csvFileInput = document.getElementById('csvFileInput');
const totalCashRevenueEl = document.getElementById('totalCashRevenue'), totalCreditCardRevenueEl = document.getElementById('totalCreditCardRevenue'), unpaidCountEl = document.getElementById('unpaidCount'), paidCountEl = document.getElementById('paidCount');
const langSwitcherBtn = document.getElementById('langSwitcherBtn'), langMenu = document.getElementById('langMenu'), langTrBtn = document.getElementById('lang-tr'), langEnBtn = document.getElementById('lang-en');
const loadingOverlay = document.getElementById('loading-overlay');
const confirmationModal = document.getElementById('confirmation-modal'), modalText = document.getElementById('modal-text'), modalConfirmBtn = document.getElementById('modal-confirm-btn'), modalCancelBtn = document.getElementById('modal-cancel-btn');
const paymentModal = document.getElementById('payment-modal'), paymentFeeEl = document.getElementById('payment-fee'), paymentCashBtn = document.getElementById('payment-cash-btn'), paymentCardBtn = document.getElementById('payment-card-btn');

// --- APP STATE ---
let vehicleRecords = [];
let recordCounter = 0;
let currentLanguage = 'tr';
let confirmAction = null;
let departureAction = null;

// --- LOCALSTORAGE FUNCTIONS ---
function saveRecordsToLocalStorage() {
    localStorage.setItem('parkingRecords', JSON.stringify(vehicleRecords));
}

function loadRecordsFromLocalStorage() {
    const records = localStorage.getItem('parkingRecords');
    if (records) {
        vehicleRecords = JSON.parse(records);
        // Convert date strings back to Date objects
        vehicleRecords.forEach(record => {
            if (record.arrival) record.arrival = new Date(record.arrival);
            if (record.departure) record.departure = new Date(record.departure);
        });
    } else {
        vehicleRecords = [];
    }
}

// --- TRANSLATIONS (Unchanged) ---
const translations = {
    loading: { tr: 'Yükleniyor...', en: 'Loading...' },
    newVehicleEntry: { tr: 'Yeni Araç Girişi', en: 'New Vehicle Entry' },
    plate: { tr: 'Plaka', en: 'Plate' },
    platePlaceholder: { tr: '34 ABC 123', en: 'AB-123-CD' },
    vehicleType: { tr: 'Araç Tipi', en: 'Vehicle Type' },
    car: { tr: 'Otomobil', en: 'Car' },
    minibus: { tr: 'Minibüs / Kamyonet', en: 'Minibus / Van' },
    bus: { tr: 'Otobüs / Kamyon', en: 'Bus / Truck' },
    arrivalTime: { tr: 'Giriş Saati', en: 'Arrival Time' },
    note: { tr: 'Not', en: 'Note' },
    notePlaceholder: { tr: 'Ekstra notlar...', en: 'Extra notes...' },
    key: { tr: 'Anahtar', en: 'Key' },
    creditCard: { tr: 'K. Kartı', en: 'Credit Card' },
    addVehicle: { tr: 'Araç Ekle', en: 'Add Vehicle' },
    addPastRecord: { tr: 'Geçmiş Kayıt Ekle', en: 'Add Past Record' },
    departureTime: { tr: 'Çıkış Saati', en: 'Departure Time' },
    feePaid: { tr: 'Ödenen Ücret', en: 'Fee Paid' },
    save: { tr: 'Kaydet', en: 'Save' },
    dailyReport: { tr: 'Günlük Rapor', en: 'Daily Report' },
    importCsv: { tr: "CSV'den Aktar", en: 'Import from CSV' },
    exportCsv: { tr: 'CSV Olarak Aktar', en: 'Export to CSV' },
    resetList: { tr: 'Listeyi Sıfırla', en: 'Reset List' },
    cashRevenue: { tr: 'Nakit Kazanç', en: 'Cash Revenue' },
    creditRevenue: { tr: 'Kredi', en: 'Credit' },
    vehiclesInside: { tr: 'İçerideki Araç', en: 'Vehicles Inside' },
    vehiclesDeparted: { tr: 'Çıkış Yapan Araç', en: 'Vehicles Departed' },
    tableNo: { tr: 'No', en: '#' },
    tablePlate: { tr: 'Plaka', en: 'Plate' },
    tableKey: { tr: 'Anahtar', en: 'Key' },
    tableArrival: { tr: 'Giriş Saati', en: 'Arrival' },
    tableDeparture: { tr: 'Çıkış Saati', en: 'Departure' },
    tableFee: { tr: 'Ücret', en: 'Fee' },
    tableNote: { tr: 'Not', en: 'Note' },
    tableAction: { tr: 'İşlem', en: 'Action' },
    paymentMethod: { tr: 'Ödeme Yöntemi', en: 'Payment Method' },
    cash: { tr: 'Nakit', en: 'Cash' },
    noVehicles: { tr: 'Otoparkta hiç araç yok.', en: 'No vehicles in the parking lot.' },
    paid: { tr: 'Ödendi', en: 'Paid' },
    depart: { tr: 'Çıkış', en: 'Depart' },
    deleteRecord: { tr: 'Sil', en: 'Delete' },
    togglePayment: { tr: 'Ödeme yöntemini değiştir', en: 'Toggle payment method' },
    confirm: { tr: 'Onayla', en: 'Confirm' },
    cancel: { tr: 'İptal', en: 'Cancel' },
    confirmReset: { tr: 'TÜMÜNÜ SİL?', en: 'DELETE ALL?' },
    confirmImport: { tr: 'Mevcut tüm veriler silinecek ve CSV dosyasındaki veriler yüklenecektir. Emin misiniz?', en: 'All current data will be deleted and replaced with data from the CSV file. Are you sure?' },
    confirmDelete: { tr: 'Emin misin?', en: 'Are you sure?' },
    errorPlate: { tr: 'Lütfen plaka girin.', en: 'Please enter a plate number.' },
    errorTime: { tr: 'Lütfen geçerli bir saat girin (SS: 00-23, DD: 00-59).', en: 'Please enter a valid time (HH: 00-23, MM: 00-59).' },
    errorPastRecord: { tr: 'Lütfen geçmiş kayıt için tüm alanları doğru doldurun.', en: 'Please fill all fields correctly for the past record.' },
    errorPastRecordStillIn: { tr: 'Lütfen plaka ve giriş saatini girin.', en: 'Please enter plate and arrival time.' },
    errorDepartureTime: { tr: 'Çıkış saati, giriş saatinden sonra olmalıdır.', en: 'Departure time must be after arrival time.' },
    errorNoExport: { tr: 'Dışa aktarılacak kayıt yok.', en: 'No records to export.' },
    errorImport: { tr: 'CSV dosyası okunurken hata oluştu. Lütfen dosya formatını kontrol edin.', en: 'Error reading CSV file. Please check the file format.' },
    errorPaymentUpdate: { tr: 'Ödeme yöntemi güncellenirken hata oluştu.', en: 'Error updating payment method.' },
    successListReset: { tr: 'Liste başarıyla sıfırlandı.', en: 'List has been reset successfully.' },
    successImport: { tr: 'Veriler başarıyla içe aktarıldı.', en: 'Data imported successfully.' },
    successDelete: { tr: 'Kayıt silindi.', en: 'Record deleted.' },
    errorDelete: { tr: 'Kayıt silinirken hata oluştu.', en: 'Error deleting record.' },
    errorAuth: { tr: 'Kimlik doğrulama hatası. Lütfen sayfayı yenileyin.', en: 'Authentication error. Please refresh the page.'},
    successExport: { tr: 'Kayıtlar CSV olarak indiriliyor.', en: 'Records are being downloaded as CSV.' },
};

// --- CORE FUNCTIONS ---

function setLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    document.title = lang === 'tr' ? 'Otopark Yönetim Sistemi' : 'Parking Management System';
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.dataset.lang;
        if (translations[key] && translations[key][lang]) el.textContent = translations[key][lang];
    });
    document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
        const key = el.dataset.langPlaceholder;
        if (translations[key] && translations[key][lang]) el.placeholder = translations[key][lang];
    });
    renderTable();
}

function showMessage(messageKey, isError = true) {
    if (!translations[messageKey] || !translations[messageKey][currentLanguage]) {
        console.error('Missing translation for key:', messageKey);
        messageText.textContent = messageKey;
    } else {
        messageText.textContent = translations[messageKey][currentLanguage];
    }
    messageBox.className = `p-3 rounded-lg text-center text-sm mt-4 border ${isError ? 'bg-red-100 dark:bg-red-900/50 border-red-400 text-red-700' : 'bg-green-100 dark:bg-green-900/50 border-green-400 text-green-700'}`;
    messageBox.classList.remove('hidden');
    setTimeout(() => { messageBox.className += ' hidden'; }, 3000);
}

function formatDateTimeForDisplay(date) {
    if (!date) return '---';
    const pad = (num) => num.toString().padStart(2, '0');
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function setDefaultArrivalTime() {
    const now = new Date();
    arrivalHourInput.value = now.getHours().toString().padStart(2, '0');
    arrivalMinuteInput.value = now.getMinutes().toString().padStart(2, '0');
}

function calculateFee(hours, vehicleType) {
    const rates = { otomobil: { "1": 75, "2": 90, "4": 120, "6": 135, "8": 150, "12": 200, "24": 250 }, minibus:  { "1": 90, "2": 120, "4": 135, "6": 150, "8": 200, "12": 250, "24": 300 }, otobus:   { "1": 100, "2": 150, "4": 200, "6": 250, "8": 300, "12": 350, "24": 400 } };
    const vehicleRates = rates[vehicleType];
    if (!vehicleRates) { return 0; }
    const dailyRate = vehicleRates["24"];
    if (hours <= 0) return 0;
    if (hours > 24) {
        let totalFee = Math.floor(hours / 24) * dailyRate;
        const remainingHours = hours % 24;
        if (remainingHours > 0) {
            for (const tier of Object.keys(vehicleRates).map(Number).sort((a, b) => a - b)) { if (remainingHours <= tier) { totalFee += vehicleRates[tier.toString()]; break; } }
        }
        return totalFee;
    }
    for (const tier of Object.keys(vehicleRates).map(Number).sort((a, b) => a - b)) { if (hours <= tier) return vehicleRates[tier.toString()]; }
    return dailyRate;
}

function updateSummaryStats() {
    const totalCashRevenue = vehicleRecords.filter(r => r.departed && !r.paidByCreditCard).reduce((sum, r) => sum + (r.fee || 0), 0);
    const totalCreditCardRevenue = vehicleRecords.filter(r => r.departed && r.paidByCreditCard).reduce((sum, r) => sum + (r.fee || 0), 0);
    const unpaidCount = vehicleRecords.filter(r => !r.departed).length;
    const paidCount = vehicleRecords.filter(r => r.departed).length;
    totalCashRevenueEl.textContent = `${totalCashRevenue} TL`;
    totalCreditCardRevenueEl.textContent = `${totalCreditCardRevenue} TL`;
    unpaidCountEl.textContent = unpaidCount;
    paidCountEl.textContent = paidCount;
}

function renderTable() {
    carRecordsTableBody.innerHTML = vehicleRecords.length === 0 ? `<tr><td colspan="8" class="text-center py-8 text-gray-500">${translations.noVehicles[currentLanguage]}</td></tr>` : '';
    const sortedRecords = [...vehicleRecords].sort((a,b) => a.arrival.getTime() - b.arrival.getTime());
    sortedRecords.forEach(record => {
        const newRow = carRecordsTableBody.insertRow();
        newRow.className = record.departed ? 'departed-row' : '';
        
        let feeHTML = '---';
        if (record.departed && record.fee != null) {
            const paymentMethodText = record.paidByCreditCard ? `(KK)` : `(N)`;
            const paymentMethodClass = record.paidByCreditCard ? 'text-purple-600 hover:text-purple-800' : 'text-green-600 hover:text-green-800';
            const toggleTitle = translations.togglePayment[currentLanguage];
            feeHTML = `<div class="flex items-center justify-start">
                           <span>${record.fee} TL</span>
                           <button class="payment-toggle-btn ml-2 font-semibold ${paymentMethodClass}" data-id="${record.id}" title="${toggleTitle}">${paymentMethodText}</button>
                       </div>`;
        } else if (record.fee != null) {
             feeHTML = `${record.fee} TL`;
        }
        
        const deleteButtonHTML = `<button class="delete-btn bg-gray-400 hover:bg-gray-500 text-white p-1 rounded-full" data-id="${record.id}" title="${translations.deleteRecord[currentLanguage]}"><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>`;
        const actionButtonHTML = record.departed
            ? `<div class="flex items-center justify-center space-x-2"><span class="font-bold text-green-500">${translations.paid[currentLanguage]}</span>${deleteButtonHTML}</div>`
            : `<div class="flex items-center justify-center space-x-2"><button class="depart-btn flex-grow bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-lg text-xs" data-id="${record.id}">${translations.depart[currentLanguage]}</button>${deleteButtonHTML}</div>`;

        newRow.innerHTML = `<td class="px-4 py-4">${record.recordId}</td><th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">${record.plate}</th><td class="px-6 py-4">${record.key ? 'Var' : 'Yok'}</td><td class="px-6 py-4">${formatDateTimeForDisplay(record.arrival)}</td><td class="px-6 py-4">${formatDateTimeForDisplay(record.departure)}</td><td class="px-6 py-4 font-bold">${feeHTML}</td><td class="px-6 py-4">${record.note || '-'}</td><td class="px-6 py-4 text-center">${actionButtonHTML}</td>`;
    });
    updateSummaryStats();
}

function finalizeDeparture(recordId, fee, isCreditCard) {
    const recordIndex = vehicleRecords.findIndex(r => r.id === recordId);
    if (recordIndex > -1 && !vehicleRecords[recordIndex].departed) {
        vehicleRecords[recordIndex].departure = new Date();
        vehicleRecords[recordIndex].fee = fee;
        vehicleRecords[recordIndex].departed = true;
        vehicleRecords[recordIndex].paidByCreditCard = isCreditCard;
        
        saveRecordsToLocalStorage();
        renderTable();
    }
    paymentModal.classList.add('hidden');
}

function showPaymentModal(recordId) {
    const record = vehicleRecords.find(r => r.id === recordId);
    if (record && !record.departed) {
        const departureTime = new Date();
        const durationInHours = (departureTime.getTime() - record.arrival.getTime()) / 3600000;
        const fee = calculateFee(durationInHours, record.type);
        paymentFeeEl.textContent = `${fee} TL`;
        paymentModal.classList.remove('hidden');
        departureAction = (isCreditCard) => finalizeDeparture(recordId, fee, isCreditCard);
    }
}

function handlePaymentToggle(recordId) {
    const recordIndex = vehicleRecords.findIndex(r => r.id === recordId);
    if (recordIndex > -1 && vehicleRecords[recordIndex].departed) {
        vehicleRecords[recordIndex].paidByCreditCard = !vehicleRecords[recordIndex].paidByCreditCard;
        saveRecordsToLocalStorage();
        renderTable();
    }
}

function addVehicle(record) {
    recordCounter++;
    record.recordId = recordCounter;
    record.id = Date.now().toString(); // Simple unique ID
    vehicleRecords.push(record);
    saveRecordsToLocalStorage();
    renderTable();
}

function showConfirmationModal(messageKey, onConfirm) {
    modalText.textContent = translations[messageKey][currentLanguage];
    confirmationModal.classList.remove('hidden');
    confirmAction = onConfirm;
}

// --- EVENT LISTENERS ---
modalCancelBtn.addEventListener('click', () => {
    confirmationModal.classList.add('hidden');
    confirmAction = null;
});

modalConfirmBtn.addEventListener('click', () => {
    if (typeof confirmAction === 'function') {
        confirmAction();
    }
    confirmationModal.classList.add('hidden');
    confirmAction = null;
});

paymentCashBtn.addEventListener('click', () => {
    if (typeof departureAction === 'function') {
        departureAction(false);
    }
});

paymentCardBtn.addEventListener('click', () => {
    if (typeof departureAction === 'function') {
        departureAction(true);
    }
});

addVehicleBtn.addEventListener('click', () => {
    const plate = plateNumberInput.value.trim().toUpperCase(), hour = parseInt(arrivalHourInput.value, 10), minute = parseInt(arrivalMinuteInput.value, 10);
    if (!plate) return showMessage("errorPlate");
    if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) return showMessage("errorTime");
    const now = new Date();
    const arrivalDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
    
    const newRecord = {
        plate: plate, type: vehicleTypeSelect.value, key: keyHandedInput.checked, note: noteInput.value.trim(), arrival: arrivalDate, departure: null, fee: null, departed: false, paidByCreditCard: false
    };
    addVehicle(newRecord);
    plateNumberInput.value = ''; noteInput.value = ''; keyHandedInput.checked = false; setDefaultArrivalTime(); plateNumberInput.focus();
});

addPastRecordBtn.addEventListener('click', () => {
    const plate = pastPlateInput.value.trim().toUpperCase();
    const arrHour = parseInt(pastArrivalHourInput.value, 10), arrMin = parseInt(pastArrivalMinuteInput.value, 10);
    const depHourRaw = pastDepartureHourInput.value, depMinRaw = pastDepartureMinuteInput.value;
    
    const now = new Date();
    let newRecord = {};

    if (depHourRaw === '' && depMinRaw === '') {
        if (!plate || isNaN(arrHour) || isNaN(arrMin)) return showMessage("errorPastRecordStillIn");
        const arrivalDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), arrHour, arrMin);
        newRecord = { plate: plate, type: pastVehicleTypeSelect.value, key: false, note: 'Manuel Giriş', arrival: arrivalDate, departure: null, fee: null, departed: false, paidByCreditCard: pastCreditCardInput.checked };
    } else {
        const depHour = parseInt(depHourRaw, 10), depMin = parseInt(depMinRaw, 10), fee = parseFloat(pastFeeInput.value);
        if (!plate || isNaN(arrHour) || isNaN(arrMin) || isNaN(depHour) || isNaN(depMin) || isNaN(fee)) return showMessage("errorPastRecord");
        const arrivalDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), arrHour, arrMin);
        const departureDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), depHour, depMin);
        if (departureDate <= arrivalDate) return showMessage("errorDepartureTime");
        newRecord = { plate: plate, type: pastVehicleTypeSelect.value, key: false, note: 'Manuel Kayıt', arrival: arrivalDate, departure: departureDate, fee: fee, departed: true, paidByCreditCard: pastCreditCardInput.checked };
    }
    addVehicle(newRecord);
    [pastPlateInput, pastArrivalHourInput, pastArrivalMinuteInput, pastDepartureHourInput, pastDepartureMinuteInput, pastFeeInput].forEach(el => el.value = '');
    pastCreditCardInput.checked = false;
});

carRecordsTableBody.addEventListener('click', (e) => { 
    const departBtn = e.target.closest('.depart-btn');
    if (departBtn) {
        showPaymentModal(departBtn.dataset.id);
        return;
    }
    const paymentToggleBtn = e.target.closest('.payment-toggle-btn');
    if (paymentToggleBtn) {
        handlePaymentToggle(paymentToggleBtn.dataset.id);
        return;
    }
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
        const recordId = deleteBtn.dataset.id;
        showConfirmationModal('confirmDelete', () => {
            const recordIndex = vehicleRecords.findIndex(r => r.id === recordId);
            if (recordIndex > -1) {
                vehicleRecords.splice(recordIndex, 1);
                saveRecordsToLocalStorage();
                renderTable();
                showMessage("successDelete", false);
            } else {
                showMessage("errorDelete", true);
            }
        });
    }
});

resetListBtn.addEventListener('click', () => {
    showConfirmationModal('confirmReset', () => {
        vehicleRecords = [];
        saveRecordsToLocalStorage();
        renderTable();
        showMessage("successListReset", false);
    });
});
        
importCsvBtn.addEventListener('click', () => csvFileInput.click());
csvFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    showConfirmationModal('confirmImport', () => {
        const reader = new FileReader();
        reader.onload = (e) => {
            vehicleRecords = []; // Clear existing records
            const text = e.target.result;
            const rows = text.split(/\r?\n/);
            const header = rows.shift().split(',').map(h => h.trim().replace(/"/g, ''));
            
            const headerMap = {};
            header.forEach((h, i) => { headerMap[h] = i; });
            
            rows.forEach(row => {
                if (row.trim() === '') return;
                const columns = row.split(',');
                try {
                    const arrivalDate = new Date(columns[headerMap[translations.tableArrival[currentLanguage]]].replace(' ', 'T'));
                    if (isNaN(arrivalDate)) return;

                    let departureDate = null;
                    const departureDateRaw = columns[headerMap[translations.tableDeparture[currentLanguage]]];
                    if (departureDateRaw) {
                        const parsedDeparture = new Date(departureDateRaw.replace(' ', 'T'));
                        if (!isNaN(parsedDeparture)) departureDate = parsedDeparture;
                    }
                    
                    const record = {
                        id: Date.now().toString() + Math.random(), // Create a unique ID
                        recordId: parseInt(columns[headerMap[translations.tableNo[currentLanguage]]]),
                        plate: columns[headerMap[translations.tablePlate[currentLanguage]]],
                        type: 'otomobil', // Defaulting type as it may not be in all CSVs
                        key: columns[headerMap[translations.tableKey[currentLanguage]]] === 'Var',
                        arrival: arrivalDate,
                        departure: departureDate,
                        fee: parseFloat(columns[headerMap[`${translations.tableFee[currentLanguage]} (TL)`]]) || null,
                        paidByCreditCard: columns[headerMap[translations.paymentMethod[currentLanguage]]] === translations.creditCard[currentLanguage],
                        note: columns[headerMap[translations.tableNote[currentLanguage]]] ? columns[headerMap[translations.tableNote[currentLanguage]]].replace(/"/g, '') : '',
                        departed: !!departureDate
                    };
                    vehicleRecords.push(record);
                } catch(err) {
                    console.error("Error parsing row during import:", row, err);
                }
            });
            saveRecordsToLocalStorage();
            renderTable();
            showMessage("successImport", false);
        };
        reader.readAsText(file, 'UTF-8');
    });
    csvFileInput.value = '';
});

exportCsvBtn.addEventListener('click', () => {
    if (vehicleRecords.length === 0) { return showMessage("errorNoExport", true); }
    const headers = [translations.tableNo[currentLanguage], translations.tablePlate[currentLanguage], translations.tableKey[currentLanguage], translations.tableArrival[currentLanguage], translations.tableDeparture[currentLanguage], `${translations.tableFee[currentLanguage]} (TL)`, translations.paymentMethod[currentLanguage], translations.tableNote[currentLanguage]];
    const formatDateTimeForCsv = (date) => date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}` : '';
    const csvRows = [headers.join(',')];
    vehicleRecords.forEach(record => {
        const row = [record.recordId, record.plate, record.key ? 'Var' : 'Yok', formatDateTimeForCsv(record.arrival), formatDateTimeForCsv(record.departure), record.fee || 0, record.paidByCreditCard ? translations.creditCard[currentLanguage] : translations.cash[currentLanguage], `"${(record.note || '').replace(/"/g, '""')}"`];
        csvRows.push(row.join(','));
    });
    const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const today = new Date();
    link.href = URL.createObjectURL(blob);
    link.download = `parking-records-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showMessage("successExport", false);
});

langSwitcherBtn.addEventListener('click', (e) => { e.stopPropagation(); langMenu.classList.toggle('hidden'); });
langTrBtn.addEventListener('click', (e) => { e.preventDefault(); setLanguage('tr'); langMenu.classList.add('hidden'); });
langEnBtn.addEventListener('click', (e) => { e.preventDefault(); setLanguage('en'); langMenu.classList.add('hidden'); });
window.addEventListener('click', () => { if (!langMenu.classList.contains('hidden')) langMenu.classList.add('hidden'); });

[arrivalHourInput, pastArrivalHourInput, pastDepartureHourInput].forEach(el => el.addEventListener('input', (e) => { if (e.target.value.length >= 2) e.target.nextElementSibling.nextElementSibling.focus(); }));
[arrivalHourInput, arrivalMinuteInput, pastArrivalHourInput, pastArrivalMinuteInput, pastDepartureHourInput, pastDepartureMinuteInput].forEach(el => el.addEventListener('input', (e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); }));

// --- INITIALIZATION ---
function initializeApp() {
    loadRecordsFromLocalStorage();
    recordCounter = vehicleRecords.reduce((max, r) => Math.max(max, r.recordId || 0), 0);
    setLanguage('tr');
    setDefaultArrivalTime();
    renderTable();
    loadingOverlay.classList.add('hidden');
}

initializeApp();