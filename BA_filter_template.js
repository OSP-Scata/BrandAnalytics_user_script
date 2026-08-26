// ==UserScript==
// @name         Brand Analytics Mod-Helper
// @namespace    http://tampermonkey.net
// @version      1.0
// @description  Автоматическая подсветка и фильтрация сложных паттернов в ленте BA по RegEx
// @author       Lemniscata
// @match        https://*.brandanalytics.ru/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Регулярные выражения для фильтрации (то, что нельзя засунуть в минус-слова)
    const regexRules = [
        {
            name: 'Кричащий капс (больше 5 слов подряд заглавными)',
            regex: /\b[А-ЯЁ]{3,}\s+[А-ЯЁ]{3,}\s+[А-ЯЁ]{3,}\s+[А-ЯЁ]{3,}\s+[А-ЯЁ]{3,}\b/g,
            color: '#ffcccc'
        },
        {
            name: 'Подозрительные ссылки / скрытый спам',
            regex: /(telegram|t\.me|vk\.cc)\/\+[A-Za-z0-9-_]{5,}/gi,
            color: '#ffe6cc'
        },
        {
            name: 'Спам крипты / заработка (комбинации триггеров)',
            regex: /(доход|заработок|выплат[аы]).{1,20}(гарант|без вложен|крипт|отзыв|задани)/gi,
            color: '#ffffcc'
        },
        {
            name: 'Более 4 эмодзи подряд (частый признак спама)',
            regex: /[😀-🙏]{4,}/gu,
            color: '#ffcccc'
        },
        {
            name: 'Спам заданий / опросов для заработка',
            regex: /(выполнять|простые|)\s*(задания|опросы|отзывы|лайки).{1,50}(телефон|доступ в|от тебя нужно)/gi,
            color: '#ffffcc'
        },
        {
            name: 'Вакансии',
            regex: /(ваканси)/gi,
            color: '#95ffb5'
        },
    ];

    // стилизация постов
        function processMentions() {
        const mentions = document.querySelectorAll('[class*="text"], [class*="mention"], .ba-mention__text');
        mentions.forEach(mention => {
            if (mention.dataset.processedByRegex || mention.innerText.length < 20) return;
            const text = mention.innerText;
            let isMatched = false;
            for (let rule of regexRules) {
                if (rule.regex.test(text)) {
                    const postCard = mention.closest('[class*="mention-card"], [class*="item"], .ba-mention, [data-id]') || mention;
                    postCard.style.backgroundColor = rule.color;
                    postCard.style.borderLeft = '6px solid #ff4d4d';
                    if (!postCard.querySelector('.regex-badge')) {
                        const badge = document.createElement('div');
                        badge.className = 'regex-badge';
                        badge.innerText = `⚠️ БОТ-ТРИГГЕР: ${rule.name}`;
                        badge.style = 'font-size: 11px; color: #ff0000; font-weight: bold; margin: 5px; padding: 3px 6px; background: #fff; display: inline-block; border-radius: 4px; border: 1px solid #ff0000;';
                        postCard.insertBefore(badge, postCard.firstChild);
                    }

                    isMatched = true;
                    break;
                }
            }

            mention.dataset.processedByRegex = 'true';
        });
    }



    // динамическое отслеживание
    const observer = new MutationObserver((mutations) => {
        processMentions();
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    setTimeout(processMentions, 2000);
})();