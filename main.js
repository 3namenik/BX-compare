/**
 * Compare
 * 
 * Объект для работы с избранным
 * 
 * Здесь храним список id сравнений
 * 
 * Для привязки действий к кнопка в верстке добавляем атрибут [data-compare-id]
 * 
 * Для отображения счетчика - [data-compare-count]
 * 
 **/

class Compare{
    constructor(){
        this.items = [];
        fetch('/local/ajax/compare.php', {
            method: 'GET'
        }).then(response => response.json()).then(data => {
            if (data.items != null && data.items.length > 0) {
                this._save_items(data.items);
            }

            this.count = this.items.length;
            
            /* Добавляем события для элементов на странице + новых динамически созданных элементов */
            document.addEventListener('click', evt => {
                let item = null;
                if (evt.target.closest('[data-compare-id]') != null) {
                    item = evt.target.closest('[data-compare-id]');
                } else{
                    if (evt.target.dataset.compareId != null) {
                        item = evt.target.dataset.compareId;
                    }
                }
                
                if (item != null) {
                    let id = item.dataset.compareId;
                    if (item.classList.contains('btn_active')){
                        this.remove_item(id);
                    } else {
                        this.add_item(id);
                    }
                }
            });

            this._redraw();
        });
    }

    /* Добавляем в сравнения */
    add_item(id){
        fetch('/local/ajax/compare.php?action=ADD_TO_COMPARE_LIST&id='+id
            ).then(response => response.json()).then(
            data => {
                this._save_items(data.items);
            }
        );
    }

    /* Удалить из сравнения */
    remove_item(id){
        fetch('/local/ajax/compare.php?action=DELETE_FROM_COMPARE_LIST&id='+id
            ).then(response => response.json()).then(
            data => {
                this._save_items(data.items);
            }
        );
    }

    /* Необходим, чтобы сделать строгую типизацию списка id */
    _save_items(items){
       
        let save = [];

        items.forEach(item => {
            save.push(Number(item));
        });

        this.items = save;
        this.count = this.items.length;
        
        this._redraw();
    }

    /* Перерисовать сравнение */
    _redraw(){
        /* Обновляем кнопки */
        document.querySelectorAll('[data-compare-id]').forEach( item => {
            if (this.items.includes(Number(item.dataset.compareId))) {
                item.classList.add('btn_active');
            } else {
                item.classList.remove('btn_active');
            }
        });

        /* Обновляем счетчик */        
        document.querySelectorAll('[data-compare-count]').forEach(item => {
            if (this.count > 0){
                item.classList.remove('deactivate');
            } else {
                item.classList.add('deactivate');
            }
            item.innerText = this.count;
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    document.compare = new Compare();
});
