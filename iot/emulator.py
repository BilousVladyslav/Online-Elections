import requests

voting = requests.get('http://127.0.0.1:8000/api/votings/active/23/', headers={"Authorization": "Token d07e8bb1eff01a07d601c73b84dbd87797c29203"}).json()
questions = requests.get('http://127.0.0.1:8000/api/votings/active/23/vote/', headers={"Authorization": "Token d07e8bb1eff01a07d601c73b84dbd87797c29203"}).json()

print('====================================================')
print(voting['voting_title'])
print(voting['voting_description'])
print()
print(f"Дата завершення: {voting['date_finished']}")
print()
print('Голосування:')
for question in questions['questions']:
    print('------------------------------------------------------')
    print(question['question_text'])
    print()
    for choice in question['choices']:
        print(f"{choice['choice_id']}:   {choice['choice_text']}")
    print('------------------------------------------------------\n')

while True:
    answ = input('Оберіть одну відповідь: ').strip()
    if answ == '38' or answ == '39':
        break

token = input('Прикладіть вашу картку доступу до датчика: ').strip()
voter = requests.get('http://127.0.0.1:8000/api/votings/active/23/vote/', headers={"Authorization": f"Token {token}"}).json()

if voter['already_voted']:
    print('Ви вже голосували, проголосувати ще раз - неможливо.')
else:
    data = {"questions": [{"id": 22,"choices": [answ]}]}
    requests.post('http://127.0.0.1:8000/api/votings/active/23/vote/', data, headers={"Authorization": f"Token {token}"}).json()
    print('Ваш голос збережено.')
