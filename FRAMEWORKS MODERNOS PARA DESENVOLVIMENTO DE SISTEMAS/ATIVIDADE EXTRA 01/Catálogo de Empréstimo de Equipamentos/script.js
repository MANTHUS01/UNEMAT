const { createApp, ref, computed, onMounted } = Vue;
        
        createApp({
            setup() {
                // Dados reativos
                const equipmentList = ref([]);
                const currentEquipment = ref({
                    id: null,
                    name: '',
                    category: '',
                    patrimonio: '',
                    status: 'disponível'
                });
                const isEditing = ref(false);
                const filterCategory = ref('');
                const filterStatus = ref('');
                
                // Carregar dados do localStorage ao inicializar
                onMounted(() => {
                    const savedEquipment = localStorage.getItem('equipmentList');
                    if (savedEquipment) {
                        equipmentList.value = JSON.parse(savedEquipment);
                    }
                });
                
                // Salvar dados no localStorage sempre que a lista mudar
                const saveToLocalStorage = () => {
                    localStorage.setItem('equipmentList', JSON.stringify(equipmentList.value));
                };
                
                // Computed properties
                const totalEquipment = computed(() => equipmentList.value.length);
                
                const availableEquipment = computed(() => 
                    equipmentList.value.filter(equip => equip.status === 'disponível').length
                );
                
                const borrowedEquipment = computed(() => 
                    equipmentList.value.filter(equip => equip.status === 'emprestado').length
                );
                
                const categories = computed(() => {
                    const cats = new Set(equipmentList.value.map(equip => equip.category));
                    return Array.from(cats).sort();
                });
                
                const filteredEquipment = computed(() => {
                    let filtered = equipmentList.value;
                    
                    if (filterCategory.value) {
                        filtered = filtered.filter(equip => 
                            equip.category === filterCategory.value
                        );
                    }
                    
                    if (filterStatus.value) {
                        filtered = filtered.filter(equip => 
                            equip.status === filterStatus.value
                        );
                    }
                    
                    return filtered;
                });
                
                const isFormValid = computed(() => {
                    return currentEquipment.value.name && 
                           currentEquipment.value.category && 
                           currentEquipment.value.patrimonio;
                });
                
                // Métodos
                const saveEquipment = () => {
                    if (!isFormValid.value) return;
                    
                    if (isEditing.value) {
                        // Atualizar equipamento existente
                        const index = equipmentList.value.findIndex(
                            equip => equip.id === currentEquipment.value.id
                        );
                        if (index !== -1) {
                            equipmentList.value[index] = {...currentEquipment.value};
                        }
                    } else {
                        // Adicionar novo equipamento
                        const newEquipment = {
                            ...currentEquipment.value,
                            id: Date.now().toString() // ID único baseado no timestamp
                        };
                        equipmentList.value.push(newEquipment);
                    }
                    
                    saveToLocalStorage();
                    resetForm();
                };
                
                const editEquipment = (equip) => {
                    currentEquipment.value = {...equip};
                    isEditing.value = true;
                    // Focar no primeiro campo do formulário para melhor acessibilidade
                    setTimeout(() => document.getElementById('name').focus(), 100);
                };
                
                const deleteEquipment = (equip) => {
                    if (confirm(`Tem certeza que deseja excluir o equipamento "${equip.name}"?`)) {
                        equipmentList.value = equipmentList.value.filter(
                            item => item.id !== equip.id
                        );
                        saveToLocalStorage();
                    }
                };
                
                const cancelEdit = () => {
                    resetForm();
                };
                
                const resetForm = () => {
                    currentEquipment.value = {
                        id: null,
                        name: '',
                        category: '',
                        patrimonio: '',
                        status: 'disponível'
                    };
                    isEditing.value = false;
                };
                
                return {
                    equipmentList,
                    currentEquipment,
                    isEditing,
                    filterCategory,
                    filterStatus,
                    totalEquipment,
                    availableEquipment,
                    borrowedEquipment,
                    categories,
                    filteredEquipment,
                    isFormValid,
                    saveEquipment,
                    editEquipment,
                    deleteEquipment,
                    cancelEdit
                };
            }
        }).mount('#app');