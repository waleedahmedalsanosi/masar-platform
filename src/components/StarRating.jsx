/**
 * @file StarRating.jsx
 * @description مكوّن عرض تقييم النجوم
 *
 * يعرض تقييماً بصرياً بالنجوم من 1 إلى 5.
 * النجوم المملوءة (★) تمثل التقييم، والفارغة (☆) تكملة الخمسة.
 */

import React from "react";

/**
 * مكوّن تقييم النجوم
 * @param {Object} props
 * @param {number} props.rating - قيمة التقييم (من 1 إلى 5)
 * @returns {JSX.Element} عنصر span يحتوي على نجوم التقييم
 */
function StarRating({ rating }) {
  return <span className="stars">{"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}</span>;
}

export default StarRating;
