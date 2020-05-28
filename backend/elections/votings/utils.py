from votings_constructor.models import Voting


def get_questions(voting: Voting) -> dict:
    result = {}
    for question in voting.questions.all():
        question_info = {'max_answers': question.max_answers, 'choices': []}
        for choice in question.choices.all():
            question_info['choices'].append(choice.id)
        result.update({str(question.id): question_info})

    return result