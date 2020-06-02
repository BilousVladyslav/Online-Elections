from votings_constructor.models import Voting


def get_questions(voting: Voting) -> dict:
    result = {}
    for question in voting.questions.all():
        question_info = {'max_answers': question.max_answers, 'choices': []}
        for choice in question.choices.all():
            question_info['choices'].append(choice.id)
        result.update({str(question.id): question_info})

    return result


def get_questions_out(voting: Voting) -> list:
    result = []
    for question in voting.questions.all():
        choices_info = []
        for choice in question.choices.all():
            choices_info.append({'choice_id': choice.id, 'choice_text': choice.choice_text})
        result.append({'question_id': question.id,
                       'question_text': question.question_text,
                       'max_answers': question.max_answers,
                       'choices': choices_info})

    return result