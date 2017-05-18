/* global $ window */
/* eslint-disable func-names, prefer-arrow-callback */
angular.module('mean.directives', [])
  .directive('player', function () {
    return {
      restrict: 'EA',
      templateUrl: '/views/player.html',
      link(scope) {
        scope.colors = ['#333', '#333', '#333', '#333', '#333', '#333'];
      }
    };
  })
  .directive('answers', function () {
    return {
      restrict: 'EA',
      templateUrl: '/views/answers.html',
      link(scope) {
        scope.$watch('game.state', () => {
          const curQ = scope.game.curQuestion;
          const startStyle = `<span style="color: ${scope.colors[scope.game.players[scope.game.winningCardPlayer].color]}">`;
          const endStyle = '</span>';
          if (scope.game.state === 'winner has been chosen') {
            const curQuestionArr = curQ.text.split('_');
            let shouldRemoveQuestionPunctuation = false;
            const removePunctuation = function (cardIndex) {
              let cardText = scope.game.table[scope.game.winningCard].card[cardIndex].text;
              if (cardText.indexOf('.', cardText.length - 2) === cardText.length - 1) {
                cardText = cardText.slice(0, cardText.length - 1);
              } else if ((cardText.indexOf('!', cardText.length - 2) === cardText.length - 1 ||
                cardText.indexOf('?', cardText.length - 2) === cardText.length - 1) &&
                cardIndex === curQ.numAnswers - 1) {
                shouldRemoveQuestionPunctuation = true;
              }
              return cardText;
            };
            if (curQuestionArr.length > 1) {
              let cardText = removePunctuation(0);
              curQuestionArr.splice(1, 0, startStyle + cardText + endStyle);
              if (curQ.numAnswers === 2) {
                cardText = removePunctuation(1);
                curQuestionArr.splice(3, 0, startStyle + cardText + endStyle);
              }
              curQ.text = curQuestionArr.join('');
              // Clean up the last punctuation mark in the question if
              // there already is one in the answer
              if (shouldRemoveQuestionPunctuation) {
                if (curQ.text.indexOf('.', curQ.text.length - 2) === curQ.text.length - 1) {
                  curQ.text = curQ.text.slice(0, curQ.text.length - 2);
                }
              }
            } else {
              curQ.text += ` ${startStyle}${scope.game.table[scope.game.winningCard].card[0].text}${endStyle}`;
            }
          } else {
            curQ.text += ` ${startStyle}${scope.game.table[scope.game.winningCard].card[0].text}${endStyle}`;
          }
        });
      }
    };
  }).directive('question', function () {
    return {
      restrict: 'EA',
      templateUrl: '/views/question.html'
    };
  })
  .directive('timer', function () {
    return {
      restrict: 'EA',
      templateUrl: '/views/timer.html'
    };
  })
  .directive('chatbox', ['socket', socket => ({
    restrict: 'AE',
    replace: true,
    link: (scope, element) => {
       // Send chat message
      scope.sendChatMessage = () => {
        const chat = {};
        chat.message = $('#chatInput').val();
        if (!chat.message) return;
        chat.date = new Date().toString();
        chat.avatar = window.localStorage.getItem('avatar');
        chat.username = window.localStorage.getItem('username');
        socket.emit('chat message', chat);
        $('.emojionearea-editor').html('');
      };

      // display a chat message
      const displayChat = (chat) => {
        const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const date = new Date(chat.date);
        element.append(
          `<div class="chat"> <div class="chat-meta">
          <img src="${chat.avatar}"> ${chat.username} <br>
          ${month[date.getMonth()]} ${date.getDate()},
          ${date.getHours()}:${date.getMinutes()} </div>
          <div class="clearfix"></div>
          <div class="chat-message">${chat.message}</div></div>`
        );
        $('#chatContent').scrollTop(element.height());
        if (chat.username !== window.localStorage.getItem('username')) {
          $('#chatNotification').show();
        }
      };

      // set current players details to localStorage and initialize the emoji
      scope.setPlayer = (avatar, username) => {
        window.localStorage.setItem('avatar', avatar);
        window.localStorage.setItem('username', username);

        $('#chatInput').emojioneArea({
          pickerPosition: 'top',
          filtersPosition: 'top',
          tones: false,
          autocomplete: false,
          inline: true,
          hidePickerOnBlur: true
        });
        scope.isPlayerSet = true;
      };

        // Initializes chat when socket is connected
      socket.on('initializeChat', (messages) => {
        messages.forEach((chat) => {
          displayChat(chat);
        });
      });

        // listen for chat messages
      socket.on('chat message', (chat) => {
        displayChat(chat);
      });

        // Submit the chat when the 'enter' key is pressed
      $('body').on('keyup', '.emojionearea-editor', (event) => {
        if (event.which === 13) {
          $('.emojionearea-editor').trigger('blur');
          scope.sendChatMessage();
        }
      });
    },
  })]);
