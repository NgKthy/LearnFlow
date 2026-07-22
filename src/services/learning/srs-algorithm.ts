export interface SrsResult {
    easeFactor: number;

    interval: number;

    repetition: number;

    nextReviewDate: Date;
}

export function calculateNextReview(
    quality: number,
    currentEase: number,
    currentInterval: number,
    currentRepetition: number
): SrsResult {

    let repetition = currentRepetition;

    let interval = currentInterval;

    //----------------------------------
    // Repetition & Interval
    //----------------------------------

    if (quality >= 3) {

        repetition += 1;

        if (repetition === 1) {

            interval = 1;

        } else if (repetition === 2) {

            interval = 6;

        } else {

            interval = Math.round(
                currentInterval *
                currentEase
            );

        }

    } else {

        repetition = 0;

        interval = 1;

    }

    //----------------------------------
    // Ease Factor
    //----------------------------------

    let easeFactor =
        currentEase +
        (
            0.1 -
            (5 - quality) *
            (
                0.08 +
                (5 - quality) * 0.02
            )
        );

    easeFactor = Math.max(
        1.3,
        easeFactor
    );

    //----------------------------------
    // Next Review
    //----------------------------------

    const nextReviewDate =
        new Date();

    nextReviewDate.setDate(
        nextReviewDate.getDate() +
        interval
    );

    //----------------------------------

    return {

        easeFactor,

        interval,

        repetition,

        nextReviewDate,

    };

}